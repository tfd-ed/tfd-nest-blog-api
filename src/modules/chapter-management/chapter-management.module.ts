import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ChapterManagementService } from './chapter-management.service';
import { ChapterManagementController } from './chapter-management.controller';
import { ChapterEntity } from './entity/chapter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChapterEntity]),
    // PassportModule.register({ defaultStrategy: 'local' }),
  ],
  exports: [ChapterManagementService],
  controllers: [ChapterManagementController],
  providers: [ChapterManagementService],
})
export class ChapterManagementModule {}
