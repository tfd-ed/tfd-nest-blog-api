import { Mailman, MailMessage } from '@squareboat/nest-mailman';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForgotEntity } from '../entity/forgot.entity';

@Injectable()
export default class EmailEvent {
  private readonly logger = new Logger(EmailEvent.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly translateService: I18nService,
    @InjectRepository(ForgotEntity)
    private readonly forgotRepository: Repository<ForgotEntity>,
  ) {}
  /**
   * An event triggered to send verification code to tester
   * @param payload
   */
  @OnEvent('user.registered', { async: true })
  async verifyEmail(payload: any) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;
    const mail = new MailMessage();
    mail
      .subject(
        this.translateService.t('event.welcome_to_tfdevs', {
          lang: payload.lang,
        }),
      )
      .view('confirm', {
        mjml: {
          minify: true,
        },
        hello: this.translateService.t('event.hello', {
          lang: payload.lang,
        }),
        header_text: this.translateService.t('event.thanks_for_registration', {
          lang: payload.lang,
        }),
        purpose_one: this.translateService.t('event.we_need_to_verify', {
          lang: payload.lang,
        }),
        // instruction: this.translateService.t('event.email', {
        //   lang: payload.lang,
        // }),
        confirmation_link: this.translateService.t('event.confirmation_link', {
          lang: payload.lang,
        }),
        you_are_receiving_this_email: this.translateService.t(
          'event.you_are_receiving_this_email',
          {
            lang: payload.lang,
          },
        ),
        tfd_right: this.translateService.t('event.tfd_right', {
          lang: payload.lang,
        }),
        privacy: this.translateService.t('event.privacy', {
          lang: payload.lang,
        }),
        tos: this.translateService.t('event.tos', {
          lang: payload.lang,
        }),
        link: url,
        fullName: payload.fullName,
        email: payload.email,
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

  @OnEvent('user.reset', { async: true })
  async resetPassword(payload: any) {
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_RESET_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    this.forgotRepository
      .save(
        this.forgotRepository.create({
          email: payload.email,
          token: token,
        }),
      )
      .then(() => {
        this.logger.log('Reset Token Created: ' + payload.email);
      });
    const url = `${this.configService.get('RESET_URL')}?token=${token}`;
    const mail = new MailMessage();
    mail
      .subject(
        this.translateService.t('event.reset_password', {
          lang: payload.lang,
        }),
      )
      .view('confirm', {
        mjml: {
          minify: true,
        },
        hello: this.translateService.t('event.hello', {
          lang: payload.lang,
        }),
        header_text: this.translateService.t(
          'event.request_to_reset_password',
          {
            lang: payload.lang,
          },
        ),
        purpose_one: this.translateService.t(
          'event.we_received_request_to_reset_password',
          {
            lang: payload.lang,
          },
        ),
        // instruction: this.translateService.t('event.email', {
        //   lang: payload.lang,
        // }),
        confirmation_link: this.translateService.t('event.confirmation_link', {
          lang: payload.lang,
        }),
        you_are_receiving_this_email: this.translateService.t(
          'event.you_are_receiving_this_email',
          {
            lang: payload.lang,
          },
        ),
        tfd_right: this.translateService.t('event.tfd_right', {
          lang: payload.lang,
        }),
        privacy: this.translateService.t('event.privacy', {
          lang: payload.lang,
        }),
        tos: this.translateService.t('event.tos', {
          lang: payload.lang,
        }),
        link: url,
        fullName: payload.fullName,
        email: payload.email,
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
