import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InstructorEntity } from './entity/instructor.entity';

@Injectable()
export class InstructorService extends TypeOrmCrudService<InstructorEntity> {
  constructor(
    @InjectRepository(InstructorEntity)
    private readonly instructorRepository: Repository<InstructorEntity>,
  ) {
    super(instructorRepository);
  }
}
