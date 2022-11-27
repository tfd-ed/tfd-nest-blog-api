import { Module } from '@nestjs/common';
import { CourseBot } from './course.bot';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbaTransferEntity } from '../../purchase/entity/aba-transfer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AbaTransferEntity])],
  providers: [CourseBot],
})
export class BotModule {}
