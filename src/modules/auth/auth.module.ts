import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { RefreshTokenStrategy } from '../common/strategy/refresh-token.strategy';
import { ForgotEntity } from '../user-auth/entity/forgot.entity';
import EmailEvent from '../user-auth/events/email.event';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';

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
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy, EmailEvent],
  exports: [AuthService],
})
export class AuthModule {}
