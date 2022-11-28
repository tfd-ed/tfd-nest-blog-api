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
import { ConfigService } from '@nestjs/config';
import { ChapterEntity } from '../chapter-management/entity/chapter.entity';
import { CourseTypeEnum } from '../common/enum/course-type.enum';
import { PurchaseEnum } from '../common/enum/purchase.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../user/entity/user.entity';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class CourseService extends TypeOrmCrudService<CourseEntity> {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(ChapterEntity)
    private readonly chaptersRepository: Repository<ChapterEntity>,
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    @InjectBot() private bot: Telegraf<Context>,
    private eventEmitter: EventEmitter2,
  ) {
    super(courseRepository);
  }
  private readonly logger = new Logger(CourseService.name);

  async purchase(id: string, payload: PurchasePayload) {
    const course = await this.courseRepository.findOne(payload.course);
    const byUser = await this.userRepository.findOne(payload.byUser);
    let purchase;
    try {
      if (course.type === CourseTypeEnum.PAID) {
        /**
         * Inform Admin Group About Course Purchase
         */
        const purchase = await this.purchaseRepository.save(
          this.purchaseRepository.create({
            ...payload,
            status: PurchaseEnum.SUBMITTED,
          }),
        );
        this.bot.telegram
          .sendMessage(
            this.configService.get('PRIVATE_GROUP_CHAT_ID'),
            `Hi there! There is a purchase on course: ${
              course.title
            } with translation ID: ${payload.transaction} valued: $${
              payload.price
            }. Please go to ${this.configService.get('ADMIN_URL')} to manage!`,
          )
          .then(() => {
            this.logger.log('Telegram message sent!');
          });

        // this.eventEmitter.emit('bots.approve', payload);
        return {
          type: CourseTypeEnum.PAID,
          id: purchase.id,
        };
      } else {
        /**
         * Free Course
         * Automatically Approved Purchased
         */
        purchase = await this.purchaseRepository.save(
          this.purchaseRepository.create({
            ...payload,
            status: PurchaseEnum.VERIFIED,
          }),
        );
        // const course_url =
        //   this.configService.get('FRONTEND_URL') + '/course/' + course.titleURL;
        //
        // this.eventEmitter.emit('admin.approved', {
        //   fullName: byUser.firstname + ' ' + byUser.lastname,
        //   link: course_url,
        //   email: byUser.email,
        //   price: purchase.price,
        //   courseTitle: course.title,
        //   timestamp: purchase.createdDate,
        // });
        return {
          type: CourseTypeEnum.FREE,
          id: purchase.id,
        };
      }
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
    // if (!purchase) {
    //   throw new NotFoundException();
    // }
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
