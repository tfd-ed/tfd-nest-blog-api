import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { UserOwnManagementService } from './user-own-management.service';
import { UserOwnManagementController } from './user-own-management.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserEntity]),
    // PassportModule.register({ defaultStrategy: 'local' }),
  ],
  exports: [UserOwnManagementService],
  controllers: [UserOwnManagementController],
  providers: [UserOwnManagementService],
})
export class UserOwnManagementModule {}
