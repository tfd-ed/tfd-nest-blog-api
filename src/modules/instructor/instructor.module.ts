import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PassportModule } from '@nestjs/passport';

import { InstructorEntity } from './entity/instructor.entity';
import { InstructorService } from './instructor.service';
import { InstructorController } from './instructor.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([InstructorEntity]),
    // PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [InstructorService],
  controllers: [InstructorController],
  providers: [InstructorService],
})
export class InstructorModule {}
