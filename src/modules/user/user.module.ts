import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { IntegrationEntity } from './entity/integration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, IntegrationEntity]),
    JwtModule.register({}),
  ],
  exports: [UsersService],
  controllers: [UserController],
  providers: [UsersService],
})
export class UserModule {}
