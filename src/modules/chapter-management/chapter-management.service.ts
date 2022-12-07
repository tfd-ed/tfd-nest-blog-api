import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChapterEntity } from './entity/chapter.entity';

export class ChapterManagementService extends TypeOrmCrudService<ChapterEntity> {
  constructor(
    @InjectRepository(ChapterEntity)
    private readonly chapterRepository: Repository<ChapterEntity>,
  ) {
    super(chapterRepository);
  }
}
