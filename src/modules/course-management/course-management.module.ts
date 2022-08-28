import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { PurchaseEntity } from '../purchase/entity/purchase.entity';
import { ChapterEntity } from '../chapter/entity/chapter.entity';
import { CourseEntity } from '../course/entity/course.entity';
import { CourseManagementController } from './course-management.controller';
import { CourseManagementService } from './course-management.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEntity, ChapterEntity, PurchaseEntity]),
    PassportModule.register({ defaultStrategy: 'local' }),
  ],
  exports: [CourseManagementService],
  controllers: [CourseManagementController],
  providers: [CourseManagementService],
})
export class CourseManagementModule {}
