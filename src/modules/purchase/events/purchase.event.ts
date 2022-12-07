import { Mailman, MailMessage } from '@squareboat/nest-mailman';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');

@Injectable()
export default class PurchaseEvent {
  private readonly logger = new Logger(PurchaseEvent.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly translateService: I18nService,
  ) {}
  /**
   * An event triggered to send verification code to tester
   * @param payload
   */
  @OnEvent('admin.approved', { async: true })
  async verifyEmail(payload: any) {
    const mail = new MailMessage();
    mail
      .subject(
        this.translateService.t('event.thanks_for_purchase', {
          lang: payload.lang,
        }),
      )
      .view('invoice', {
        mjml: {
          minify: true,
        },
        thanks_for_purchase: this.translateService.t(
          'event.thanks_for_purchase',
          {
            lang: 'kh',
          },
        ),
        payment_method: this.translateService.t('event.payment_method', {
          lang: 'kh',
        }),
        total: this.translateService.t('event.total', {
          lang: 'kh',
        }),
        date_of_purchase: moment(payload.timestamp).format('L'),
        course_title: payload.courseTitle,
        price: payload.price,
        link: payload.link,
        start_learning: this.translateService.t('event.start_learning', {
          lang: 'kh',
        }),
        you_are_receiving_this_email: this.translateService.t(
          'event.you_are_receiving_this_email',
          {
            lang: 'kh',
          },
        ),
        tfd_right: this.translateService.t('event.tfd_right', {
          lang: 'kh',
        }),
        privacy: this.translateService.t('event.privacy', {
          lang: 'kh',
        }),
        tos: this.translateService.t('event.tos', {
          lang: 'kh',
        }),
        fullName: payload.fullName,
      });

    Mailman.init()
      .to(payload.email)
      .from('"TFD" <info@tfdevs.com>')
      .replyTo('no-reply@tfdevs.com')
      .send(mail)
      .then(() => {
        this.logger.log('Email to: ' + payload.email + ' sent!');
      });
  }
}
