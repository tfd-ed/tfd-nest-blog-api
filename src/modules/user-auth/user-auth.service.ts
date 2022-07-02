import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
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

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  async resetPassword(email: string, i18n: I18nContext) {
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
    });
    return email;
  }
}
