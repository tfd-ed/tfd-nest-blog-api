import {
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async createToken(user: UserEntity) {
    return {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
      accessToken: this.jwtService.sign({ id: user.id }),
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
}
