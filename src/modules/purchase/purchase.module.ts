import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { PurchaseEntity } from './entity/purchase.entity';
import { CourseEntity } from '../course/entity/course.entity';
import { ConfigService } from '@nestjs/config';
import PurchaseEvent from './events/purchase.event';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseEntity, CourseEntity]),
    PassportModule.register({ defaultStrategy: 'local' }),
  ],
  exports: [PurchaseService],
  controllers: [PurchaseController],
  providers: [PurchaseService, ConfigService, PurchaseEvent],
})
export class PurchaseModule {}
