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

@Injectable()
export class CourseService extends TypeOrmCrudService<CourseEntity> {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
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
  ): Promise<Pagination<CourseEntity>> {
    const queryBuilder = this.courseRepository.createQueryBuilder('course');
    queryBuilder.andWhere('course.id =:id', {
      id: id,
    });
    queryBuilder.leftJoinAndSelect('course.chapters', 'chapters');
    return paginate<CourseEntity>(queryBuilder, options);
  }
}
