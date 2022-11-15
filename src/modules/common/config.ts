/**
 * This is a common config file for project
 * Production environment for testing the latest code on branch develop on Heroku
 * After the develop branch is merged, it will automatically trigger Heroku deployment
 * APP_ENV is used in Heroku environment as 'prod'
 * --
 * Docker is used only for local development
 * When developing locally, APP_ENV = dev is used
 */
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { MailmanOptions } from '@squareboat/nest-mailman';
import { CacheModuleOptions } from '@nestjs/common';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const appRoot = require('app-root-path');

export async function redisConfig(configService: ConfigService) {
  const env = configService.get<string>('APP_ENV');
  if (env === 'dev') {
    return {
      ttl: configService.get('CACHE_TTL'), // seconds
      max: configService.get('CACHE_MAX'), // maximum number of items in cache
      store: redisStore,
      host: configService.get('CACHE_HOST'),
      port: configService.get('CACHE_PORT'),
    } as CacheModuleOptions;
  }
  if (env === 'prod') {
    /**
     * Prevent Application crashes as cloud service provider
     * usually rotates credential for security reason
     * REDIS_URL is rotated overtime
     */
    const db_host_port = configService
      .get('REDIS_URL')
      .toString()
      .split('@')[1];
    const db_host = db_host_port.split(':')[0];
    return {
      ttl: configService.get('CACHE_TTL'), // seconds
      max: configService.get('CACHE_MAX'), // maximum number of items in cache
      store: redisStore,
      url: configService.get('REDIS_URL'),
      tls: {
        servername: db_host,
        rejectUnauthorized: false,
      },
    };
  }
}
export async function typeormConfig(configService: ConfigService) {
  const env = configService.get<string>('APP_ENV');
  if (env === 'dev') {
    return {
      type: configService.get<string>('DB_TYPE'),
      host: configService.get<string>('DB_HOST'),
      port: configService.get<string>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      maxQueryExecutionTime: 1000,
      // logging: true,
      synchronize: true,
      migrationsRun: false,
      dropSchema: false,
      entities: [join(__dirname, './../**/**.entity{.ts,.js}')],
      subscribers: [join(__dirname, './../**/**.subscriber{.ts,.js}')],
      migrations: [join(__dirname, './../../migrations/{.ts,*.js}')],
      cli: {
        migrationsDir: 'src/migrations',
      },
    } as TypeOrmModuleAsyncOptions;
  }
  if (env === 'prod') {
    /**
     * DB_USERNAME and DB_PASSWORD are not needed when the whole DB URL is provided
     */
    return {
      type: configService.get<string>('DB_TYPE'),
      url: configService.get<string>('DATABASE_URL'),
      // username: configService.get<string>('DB_USERNAME'),
      // password: configService.get<string>('DB_PASSWORD'),
      entities: [__dirname + './../**/**.entity{.ts,.js}'],
      subscribers: [__dirname + './../**/**/*.subscriber.{ts,js}'],
      migrations: [join(__dirname, './../../migrations/{.ts,*.js}')],
      synchronize: false,
      /**
       * Migration is automatically performed on prod server
       * by putting migrationsRun: true
       */
      migrationsRun: true,
      ssl: true,
      retryAttempts: 20,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    } as TypeOrmModuleAsyncOptions;
  }
}
export async function throttlerConfig(configService: ConfigService) {
  const env = configService.get<string>('APP_ENV');
  let redisObj;
  /**
   * REDIS_URL is periodically rotated
   */
  const cache_host_port = configService
    .get('REDIS_URL')
    .toString()
    .split('@')[1];
  const cache_password_head = configService
    .get('REDIS_URL')
    .toString()
    .split('@')[0];
  const cache_password = cache_password_head.split(':')[2];
  const cache_host = cache_host_port.split(':')[0];
  const cache_port = cache_host_port.split(':')[1];
  if (env === 'dev') {
    redisObj = {
      host: configService.get('CACHE_HOST'),
      port: configService.get('CACHE_PORT'),
    };
  } else {
    redisObj = {
      host: cache_host,
      port: cache_port,
      // username: configService.get('CACHE_USER'),
      password: cache_password,
      // url: configService.get('REDIS_URL'),
      tls: {
        servername: cache_host,
        rejectUnauthorized: false,
      },
    };
  }
  return {
    ttl: configService.get('THROTTLE_TTL'),
    limit: configService.get('THROTTLE_LIMIT'),
    storage: new ThrottlerStorageRedisService(redisObj),
  };
}
export async function mailMainConfig(configService: ConfigService) {
  return {
    host: configService.get('EMAIL_HOST'),
    port: +configService.get('EMAIL_PORT'),
    username: configService.get('EMAIL_USER'),
    password: configService.get('EMAIL_PASSWORD'),
    from: configService.get('MAIL_SENDER_ID'),
    path: appRoot + '/src/templates',
  } as MailmanOptions;
}
export async function bullConfig(configService: ConfigService) {
  const env = configService.get<string>('APP_ENV');
  if (env === 'dev') {
    return {
      redis: {
        host: configService.get('CACHE_HOST'),
        port: configService.get('CACHE_PORT'),
      },
      prefix: 'tfd-jobs',
      // defaultJobOptions: {
      //   removeOnComplete: true,
      // },
    };
  }
  const db_host_port = configService.get('REDIS_URL').toString().split('@')[1];
  const db_host = db_host_port.split(':')[0];
  if (env === 'prod') {
    return {
      redis: {
        url: configService.get('REDIS_URL'),
        tls: {
          maxRetriesPerRequest: 100,
          enableReadyCheck: false,
          servername: db_host,
          rejectUnauthorized: false,
        },
      },
      prefix: 'tfd-jobs',
      // defaultJobOptions: {
      //   removeOnComplete: true,
      // },
    };
  }
}
