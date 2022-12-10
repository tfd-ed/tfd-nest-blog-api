import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from '../../utils/Hash';
import { LoginPayload } from './payloads/login.payload';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';
import { I18nContext } from 'nestjs-i18n';
import { AppRoles } from '../common/enum/roles.enum';
import { UserStatus } from '../common/enum/userStatus.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ForgotEntity } from './entity/forgot.entity';
import { RegisterPayload } from './payloads/register.payload';
import { ResetPayload } from './payloads/reset.payload';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ForgotEntity)
    private readonly forgotRepository: Repository<ForgotEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createToken(user: UserEntity) {
    return {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
      accessToken: this.jwtService.sign(
        { id: user.id },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: Number(this.configService.get('JWT_EXPIRATION_TIME')),
        },
      ),
      user,
    };
  }

  async validateUser(
    payload: LoginPayload,
    i18n: I18nContext,
  ): Promise<UserEntity> {
    const user = await this.userService.getByEmail(payload.email);
    if (!user || !Hash.compare(payload.password, user.password)) {
      throw new UnauthorizedException(i18n.t('error.invalid_credential'));
    }
    if (user.status === UserStatus.UNCONFIRMED) {
      throw new UnauthorizedException(i18n.t('error.unconfirmed'));
    }
    return user;
  }

  async validateAdmin(
    payload: LoginPayload,
    i18n: I18nContext,
  ): Promise<UserEntity> {
    const user = await this.userService.getByEmail(payload.email);
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    if (!user.roles.includes(AppRoles.ADMINS)) {
      throw new UnauthorizedException('Only admin user allowed!');
    }
    if (!user || !Hash.compare(payload.password, user.password)) {
      throw new UnauthorizedException(i18n.t('error.invalid_credential'));
    }
    return user;
  }

  async register(payload: RegisterPayload, i18n: I18nContext) {
    // const users = await this.userRepository.find({
    //   // Apply or where condition
    //   where: [{ email: payload.email }],
    // });
    const email = payload.email;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
    if (user) {
      throw new BadRequestException(i18n.t('error.user_already_existed'));
    }
    // const hashedPassword = Hash.make(payload.password);
    const final = await this.userRepository.save(
      this.userRepository.create({
        ...payload,
        username:
          payload.firstname.toLocaleLowerCase() +
          '-' +
          payload.lastname.toLocaleLowerCase() +
          '-' +
          Date.now(),
        status: UserStatus.UNCONFIRMED,
        // password: hashedPassword,
      }),
    );
    /**
     * Create and Persist Refresh Token
     */
    const tokens = await this.getTokens(final.id);
    await this.updateRefreshToken(final.id, tokens.refreshToken);
    /**
     * Send Email to User for Confirmation
     */
    this.eventEmitter.emit('user.registered', {
      fullName: final.firstname + ' ' + final.lastname,
      email: final.email,
      lang: i18n.lang,
    });
    return final;
  }

  async logout(userId: string) {
    return this.userRepository.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = Hash.compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async markEmailAsConfirmed(email: string) {
    return this.userRepository.update(
      { email },
      {
        status: UserStatus.ACTIVE,
      },
    );
  }

  public async decodeConfirmationToken(token: string, i18n: I18nContext) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException(i18n.t('error.token_expired'));
      }
      throw new BadRequestException(i18n.t('error.invalid_token'));
    }
  }

  public async confirmEmail(email: string, i18n: I18nContext) {
    const user = await this.getByEmail(email);
    if (
      user.status === UserStatus.CONFIRMED ||
      user.status === UserStatus.ACTIVE
    ) {
      throw new BadRequestException(i18n.t('error.email_already_conformed'));
    }
    await this.markEmailAsConfirmed(email);
    return {
      email: email,
      result: 'Email confirmed!',
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = Hash.make(refreshToken);
    this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
          expiresIn: Number(this.configService.get('JWT_EXPIRATION_TIME')),
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: Number(
            this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ email: email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async forgotPassword(email: string, i18n: I18nContext) {
    const users = await this.userRepository.find({
      // Apply or where condition
      where: [{ email: email }],
    });
    if (!users.length) {
      throw new BadRequestException(i18n.t('error.user_not_exist'));
    }
    this.eventEmitter.emit('user.reset', {
      fullName: users[0].firstname + ' ' + users[0].lastname,
      email: email,
      lang: i18n.lang,
      timestamp: Date.now(),
    });
    return email;
  }

  async verifyResetToken(token: string, i18n: I18nContext) {
    const resetToken = await this.forgotRepository.findOne({
      token: token,
    });
    /**
     * Check if such token existed in the database
     */
    if (!resetToken) {
      throw new BadRequestException(i18n.t('error.token_not_exist'));
    }
    /**
     * Check if this token is already used to reset the password before
     */
    if (resetToken.done) {
      throw new BadRequestException(i18n.t('error.token_already_used'));
    }
    /**
     * Check if the token is valid and not expired
     */
    const email = await this.decodeConfirmationToken(token, i18n);
    return {
      email: email,
      resetToken: resetToken,
    };
  }

  async resetPassword(payload: ResetPayload, i18n: I18nContext) {
    const user = await this.userRepository.findOne({ email: payload.email });
    if (!user) {
      throw new BadRequestException(i18n.t('error.user_not_exist'));
    }
    const verified = await this.verifyResetToken(payload.token, i18n);
    if (verified.email !== payload.email) {
      throw new BadRequestException(i18n.t('error.mismatched_email'));
    }
    /**
     * Everything is okay, proceed to update password
     */
    this.userRepository
      .update(user.id, {
        password: payload.password,
      })
      .then(() => {
        this.logger.log('User: ' + user.username + ' password reset!');
      });
    /**
     * Mark token as was used
     */
    this.forgotRepository
      .update(verified.resetToken.id, {
        done: true,
      })
      .then(() => {
        this.logger.log(
          'Token: ' + verified.resetToken.token + ' marked as done!',
        );
      });
    return { message: 'Password reset' };
  }
}
