import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entity/file.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    PassportModule.register({ defaultStrategy: 'local' }),
  ],
  exports: [FileService],
  controllers: [FileController],
  providers: [FileService, ConfigService],
})
export class FileModule {}
