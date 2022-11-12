import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStatus } from '../common/enum/userStatus.enum';
import { RegisterPayload } from './payloads/register.payload';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { UserEntity } from '../user/entity/user.entity';
import { ResetPayload } from './payloads/reset.payload';
import { ForgotEntity } from './entity/forgot.entity';

@Injectable()
export class UserAuthService {
  private readonly logger = new Logger(UserAuthService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ForgotEntity)
    private readonly forgotRepository: Repository<ForgotEntity>,
    private eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, // private readonly translateService: I18nService,
  ) {}
  /**
   * Register a user and invoke the mailing service
   * @param payload
   * @param i18n
   */
  async register(payload: RegisterPayload, i18n: I18nContext) {
    const users = await this.userRepository.find({
      // Apply or where condition
      where: [{ email: payload.email }],
    });
    if (users.length) {
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
    this.eventEmitter.emit('user.registered', {
      fullName: final.firstname + ' ' + final.lastname,
      email: final.email,
      lang: i18n.lang,
    });
    return final;
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
