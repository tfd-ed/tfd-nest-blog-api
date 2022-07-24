import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ChapterEntity } from './entity/chapter.entity';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChapterEntity]),
    PassportModule.register({ defaultStrategy: 'local' }),
  ],
  exports: [ChapterService],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
