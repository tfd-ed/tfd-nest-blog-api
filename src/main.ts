import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './swagger';
import { CrudConfigService } from '@nestjsx/crud';

/**
 * Configure default Typeorm CRUD behavior
 * to omit hard delete
 */
CrudConfigService.load({
  query: {
    // limit: 10,
    cache: 2000,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: {
    updateOneBase: {
      allowParamsOverride: true,
    },
  },
});
import { useContainer } from 'class-validator';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';

import { getBotToken } from 'nestjs-telegraf';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });
  if (configService.get('APP_ENV') == 'dev') {
    setupSwagger(app);
  }
  // Enable Cors for development
  /**
   * Enable Cors for development
   */
  app.enableCors({
    origin: [
      configService.get('FRONTEND_URL'),
      configService.get('ADMIN_URL'),
      configService.get('TEST_URL'),
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Forwarded-Proto',
    ],
    exposedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-Forwarded-Proto',
    ],
  });
  if (configService.get('APP_ENV') !== 'dev') {
    app.set('trust proxy', 1);
  }
  app.use(helmet());
  // Global Pipe to intercept request and format data accordingly
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  /**
   * Telegram Bot Config
   */
  // const bot = app.get(getBotToken());
  // app.use(bot.webhookCallback('/hooks'));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // Listen to port given by environment on production server (Heroku, DigitalOcean App,..), otherwise 3000
  // Specify '0.0.0.0' in the listen() to accept connections on other hosts.
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
