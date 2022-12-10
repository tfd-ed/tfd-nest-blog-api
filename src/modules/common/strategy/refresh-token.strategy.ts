import { ExtractJwt, Strategy, JwtPayload } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// function getCookieByName(request: Request, name: string) {
//   const cookie = {};
//   request
//     .get('Cookie')
//     .split(';')
//     .forEach(function (el) {
//       const [k, v] = el.split('=');
//       cookie[k.trim()] = v;
//     });
//   return cookie[name];
// }

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies['auth._refresh_token.local'];
        },
      ]),
      passReqToCallback: true,
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const refreshToken = request?.cookies['auth._refresh_token.local'];

    return { ...payload, refreshToken };
  }
}
