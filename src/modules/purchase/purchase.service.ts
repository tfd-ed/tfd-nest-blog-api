import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PurchaseEntity } from './entity/purchase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseEnum } from '../common/enum/purchase.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../user/entity/user.entity';
import { CourseEntity } from '../course/entity/course.entity';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserStatus } from '../common/enum/userStatus.enum';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Pusher = require('pusher');

@Injectable()
export class PurchaseService
  extends TypeOrmCrudService<PurchaseEntity>
  implements OnModuleInit
{
  constructor(
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
    @InjectBot() private bot: Telegraf<Context>,
  ) {
    super(purchaseRepository);
  }
  private readonly logger = new Logger(PurchaseService.name);
  private pusher;

  onModuleInit() {
    /**
     * Initialize Pusher
     */
    this.pusher = new Pusher({
      appId: this.configService.get('PUSHER_APP_ID'),
      key: this.configService.get('PUSHER_APP_KEY'),
      secret: this.configService.get('PUSHER_SECRET'),
      cluster: this.configService.get('PUSHER_CLUSTER'),
      useTLS: true,
      // encrypted: true,
    });
    this.logger.log('Pusher Initialized');
  }
  async approvePurchase(purchaseId: string) {
    const purchase = await this.purchaseRepository.findOne(
      { id: purchaseId },
      { relations: ['byUser', 'course'] },
    );
    if (purchase.status === PurchaseEnum.VERIFIED) {
      return {
        message: 'already verified!',
        id: purchaseId,
      };
    }

    await this.purchaseRepository.update(
      {
        id: purchaseId,
      },
      {
        status: PurchaseEnum.VERIFIED,
      },
    );

    const user: unknown = <unknown>purchase.byUser;
    const byUser: UserEntity = <UserEntity>user;

    const course: unknown = <unknown>purchase.course;
    const courseF: CourseEntity = <CourseEntity>course;

    const course_url =
      this.configService.get('FRONTEND_URL') + '/course/' + courseF.titleURL;

    /**
     * Send email only if user's email is confirmed
     */
    if (byUser.status === UserStatus.ACTIVE) {
      this.eventEmitter.emit('admin.approved', {
        fullName: byUser.firstname + ' ' + byUser.lastname,
        link: course_url,
        email: byUser.email,
        price: purchase.price,
        courseTitle: courseF.title,
        timestamp: purchase.createdDate,
      });
    }

    try {
      /**
       * Trigger realtime event to client
       */
      this.pusher.trigger(
        `${byUser.username}_${courseF.titleURL}_purchase`,
        'purchase-approved',
        {
          id: purchaseId,
          status: PurchaseEnum.VERIFIED,
          price: purchase.price,
          transaction: purchase.transaction,
          createdDate: purchase.createdDate,
          updatedDate: purchase.updatedDate,
        },
      );

      /**
       * Inform group that the purchase was approved
       */
      this.bot.telegram
        .sendMessage(
          this.configService.get('PRIVATE_GROUP_CHAT_ID'),
          `Hi there! The purchase with transaction: ${purchase.transaction} was approved already.`,
        )
        .then(() => {
          this.logger.log('Telegram message sent!');
        });
    } catch (e) {
      throw new RuntimeException(e);
    }
  }
}
