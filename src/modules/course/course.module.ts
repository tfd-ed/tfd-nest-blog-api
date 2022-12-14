import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entity/course.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PurchaseEntity } from '../purchase/entity/purchase.entity';
import { ConfigService } from '@nestjs/config';
import { ChapterEntity } from '../chapter-management/entity/chapter.entity';
import { UserEntity } from '../user/entity/user.entity';
import BotApproveEvent from './event/BotApprove.event';
import { AbaTransferEntity } from '../purchase/entity/aba-transfer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      ChapterEntity,
      PurchaseEntity,
      UserEntity,
      AbaTransferEntity,
    ]),
    // PassportModule.register({ defaultStrategy: 'local' }),
  ],
  exports: [CourseService],
  controllers: [CourseController],
  providers: [CourseService, ConfigService, BotApproveEvent],
})
export class CourseModule {}
