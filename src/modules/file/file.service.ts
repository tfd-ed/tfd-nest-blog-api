import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity, FileFillableFields } from './entity/file.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileService {
  public s3;
  private readonly logger = new Logger(FileService.name);
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  /**
   * Retrieve file
   * @param id file id
   */
  async getFile(id: string) {
    const file = await this.fileRepository.findOne(id);
    try {
      const getParams = {
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
      };
      const data = await this.s3.send(new GetObjectCommand(getParams));
      return {
        data: data,
        file: file,
      };
    } catch (err) {
      console.log('Error', err);
    }
  }

  /**
   * Upload image to AWS
   * @param image to be saved
   */
  async uploadImage(image: FileFillableFields) {
    const uploadParam = {
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Body: image.buffer,
      Key: `${Date.now().toString()}-${uuid()}-${image.name}`,
    };
    this.s3.send(new PutObjectCommand(uploadParam)).then((result) => {
      this.logger.log(
        ' Command Sent with : ' + result.$metadata.httpStatusCode,
      );
    });
    const href =
      'https://s3.' + this.configService.get('AWS_REGION') + '.amazonaws.com/';
    const path =
      href +
      this.configService.get('AWS_PUBLIC_BUCKET_NAME') +
      '/' +
      uploadParam.Key;
    const uploadedImage = await this.fileRepository.save(
      this.fileRepository.create({
        name: image.name,
        path: path,
        mimeType: image.mimeType,
        size: image.size,
        key: uploadParam.Key,
      }),
    );
    /**
     * Update Image URL
     */
    this.fileRepository
      .update(uploadedImage.id, {
        url:
          this.configService.get('APP_URL') + `/v1/files/${uploadedImage.id}`,
      })
      .then((r) => {
        this.logger.log('Image: ' + uploadedImage.id + ' saved');
      });
    return uploadedImage;
  }
}
