import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { CourseEntity } from './entity/course.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEntity]),
    PassportModule.register({ defaultStrategy: 'local' }),
  ],
  exports: [CourseService],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
