import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CourseEntity } from './entity/course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from '../purchase/entity/purchase.entity';
import { PurchasePayload } from './payload/purchase.payload';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ChapterPayload } from './payload/chapter.payload';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { ChapterEntity } from '../chapter-management/entity/chapter.entity';

@Injectable()
export class CourseService extends TypeOrmCrudService<CourseEntity> {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(ChapterEntity)
    private readonly chaptersRepository: Repository<ChapterEntity>,
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
    private readonly configService: ConfigService,
    @InjectBot() private bot: Telegraf<Context>,
  ) {
    super(courseRepository);
  }
  private readonly logger = new Logger(CourseService.name);

  async purchase(id: string, payload: PurchasePayload) {
    try {
      /**
       * Inform Admin Group About Course Purchase
       */
      this.bot.telegram
        .sendMessage(
          this.configService.get('PRIVATE_GROUP_CHAT_ID'),
          `Hi there! There is a purchase with translation ID: ${
            payload.transaction
          } valued: $${payload.price}. Please go to ${this.configService.get(
            'ADMIN_URL',
          )} to manage!`,
        )
        .then(() => {
          this.logger.log('Telegram message sent!');
        });
      return await this.purchaseRepository.save(
        this.purchaseRepository.create(payload),
      );
    } catch (error) {
      this.logger.log(error);
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
      this.logger.log(error);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
