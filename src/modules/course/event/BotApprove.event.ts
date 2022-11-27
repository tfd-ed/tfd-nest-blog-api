import { Injectable, Logger } from '@nestjs/common';
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
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('bots.approve', { async: true })
  async BotApprove(payload: any) {
    const payment = this.abaTransfer.findOne({
      price: payload.price,
      transaction: payload.transaction,
    });
    const course = await this.courseRepository.findOne(payload.course);
    const byUser = await this.userRepository.findOne(payload.byUser);
    if (payment) {
      /**
       * Payment Exist, Save DB Bot Approve
       */
      await this.purchaseRepository.save(
        this.purchaseRepository.create({
          ...payload,
          status: PurchaseEnum.VERIFIED,
        }),
      );
      const course_url =
        this.configService.get('FRONTEND_URL') + '/course/' + course.titleURL;

      /**
       * Inform User
       */
      this.eventEmitter.emit('admin.approved', {
        fullName: byUser.firstname + ' ' + byUser.lastname,
        link: course_url,
        email: byUser.email,
        price: payload.price,
        courseTitle: course.title,
        timestamp: Date.now(),
      });
    }
  }
}
