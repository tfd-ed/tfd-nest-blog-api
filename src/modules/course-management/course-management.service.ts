import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from '../purchase/entity/purchase.entity';

import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ChapterEntity } from '../chapter/entity/chapter.entity';
import { PurchasePayload } from '../course/payload/purchase.payload';
import { ChapterPayload } from '../course/payload/chapter.payload';
import { CourseEntity } from '../course/entity/course.entity';

@Injectable()
export class CourseManagementService extends TypeOrmCrudService<CourseEntity> {
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
