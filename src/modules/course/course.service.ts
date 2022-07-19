import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CourseEntity } from './entity/course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from './entity/purchase.entity';
import { PurchasePayload } from './payload/purchase.payload';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ChapterEntity } from './entity/chapter.entity';
import { ChapterPayload } from './payload/chapter.payload';

@Injectable()
export class CourseService extends TypeOrmCrudService<CourseEntity> {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(ChapterEntity)
    private readonly chaptersRepository: Repository<ChapterEntity>,
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
  ) {
    super(courseRepository);
  }

  async purchase(id: string, payload: PurchasePayload) {
    try {
      return await this.purchaseRepository.save(
        this.purchaseRepository.create(payload),
      );
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getChapters(
    id: string,
    options: IPaginationOptions,
  ): Promise<Pagination<ChapterEntity>> {
    const queryBuilder = this.chaptersRepository.createQueryBuilder('chapters');
    queryBuilder.andWhere('chapters.id =:id', {
      id: id,
    });
    return paginate<ChapterEntity>(queryBuilder, options);
  }

  async userPurchase(id: string, userId: string) {
    return await this.purchaseRepository.findOne({
      course: id,
      byUser: userId,
    });
  }

  async newChapter(payload: ChapterPayload) {
    try {
      return await this.chaptersRepository.save(
        this.chaptersRepository.create(payload),
      );
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
