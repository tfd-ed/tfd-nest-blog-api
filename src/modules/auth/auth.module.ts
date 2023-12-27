import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { RefreshTokenStrategy } from '../common/strategy/refresh-token.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import EmailEvent from './events/email.event';
import { ForgotEntity } from './entity/forgot.entity';
import { GoogleStrategy } from '../common/strategy/google.strategy';
import { FacebookStrategy } from '../common/strategy/facebook-strategy';
import { GithubStrategy } from '../common/strategy/github.strategy';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity, ForgotEntity]),
    JwtModule.register({}),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => {
    //     return {
    //       secret: configService.get<string>('JWT_SECRET_KEY'),
    //       signOptions: {
    //         ...(configService.get<string>('JWT_EXPIRATION_TIME')
    //           ? {
    //               expiresIn: Number(configService.get('JWT_EXPIRATION_TIME')),
    //             }
    //           : {}),
    //       },
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    FacebookStrategy,
    GithubStrategy,
    EmailEvent,
  ],
  exports: [AuthService],
})
export class AuthModule {}
