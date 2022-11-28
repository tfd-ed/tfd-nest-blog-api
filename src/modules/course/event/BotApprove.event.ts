import {
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AbaTransferEntity } from '../../purchase/entity/aba-transfer.entity';
import { Repository } from 'typeorm';
import { PurchaseEntity } from '../../purchase/entity/purchase.entity';
import { PurchaseEnum } from '../../common/enum/purchase.enum';
import { UserEntity } from '../../user/entity/user.entity';
import { CourseEntity } from '../entity/course.entity';
import { PaymentEnum } from '../../common/enum/payment.enum';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export default class BotApproveEvent {
  private readonly logger = new Logger(BotApproveEvent.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly translateService: I18nService,
    @InjectRepository(AbaTransferEntity)
    private readonly abaTransfer: Repository<AbaTransferEntity>,
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    // private eventEmitter: EventEmitter2,
    @InjectBot() private bot: Telegraf<Context>,
  ) {}

  @OnEvent('bots.approve', { async: true })
  async BotApprove(payload: any) {
    const payment = await this.abaTransfer.findOne({
      where: {
        price: payload.price,
        transaction: payload.transaction,
        status: PaymentEnum.PENDING,
      },
    });
    if (payment) {
      const course = await this.courseRepository.findOne(payload.course);
      const byUser = await this.userRepository.findOne(payload.byUser);
      /**
       * Payment Exist, Save DB Bot Approve
       */
      try {
        await this.purchaseRepository.save(
          this.purchaseRepository.create({
            ...payload,
            status: PurchaseEnum.VERIFIED,
          }),
        );
      } catch (e) {
        return new NotAcceptableException(e);
      }

      /**
       * Update to DONE
       */
      await this.abaTransfer.update(payment.id, {
        status: PaymentEnum.DONE,
      });
      const course_url =
        this.configService.get('FRONTEND_URL') + '/course/' + course.titleURL;

      /**
       * Inform User
       */
      // this.eventEmitter.emit('admin.approved', {
      //   fullName: byUser.firstname + ' ' + byUser.lastname,
      //   link: course_url,
      //   email: byUser.email,
      //   price: payload.price,
      //   courseTitle: course.title,
      //   transaction: payload.transaction,
      //   timestamp: Date.now(),
      // });
      /**
       * Inform InTelegram
       */
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
    } else {
      this.logger.log('No Payment Found!');
      return new NotFoundException();
    }
  }
}
