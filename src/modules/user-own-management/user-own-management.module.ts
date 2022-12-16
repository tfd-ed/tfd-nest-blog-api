import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UserEntity } from '../user/entity/user.entity';
import { UserOwnManagementService } from './user-own-management.service';
import { UserOwnManagementController } from './user-own-management.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    // PassportModule.register({ defaultStrategy: 'local' }),
  ],
  exports: [UserOwnManagementService],
  controllers: [UserOwnManagementController],
  providers: [UserOwnManagementService],
})
export class UserOwnManagementModule {}
