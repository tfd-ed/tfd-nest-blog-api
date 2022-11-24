import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { CourseEntity } from './entity/course.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PurchaseEntity } from '../purchase/entity/purchase.entity';
import { ConfigService } from '@nestjs/config';
import { ChapterEntity } from '../chapter-management/entity/chapter.entity';
import { PurchaseService } from '../purchase/purchase.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEntity, ChapterEntity, PurchaseEntity]),
    PassportModule.register({ defaultStrategy: 'local' }),
  ],
  exports: [CourseService],
  controllers: [CourseController],
  providers: [CourseService, ConfigService, PurchaseService],
})
export class CourseModule {}
