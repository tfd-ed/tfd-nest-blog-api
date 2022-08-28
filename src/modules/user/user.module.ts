import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './user.service';
import { PurchaseEntity } from '../purchase/entity/purchase.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PurchaseEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [UsersService],
  controllers: [UserController],
  providers: [UsersService],
})
export class UserModule {}
