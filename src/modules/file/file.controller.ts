import {
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ForbiddenDto } from '../common/schema/forbidden.dto';
import { FileService } from './file.service';
import { ApiFile } from '../common/file/ApiFile';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilterUtils } from '../common/filter/FileFilter.utils';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import { JwtAuthGuard } from '../common/guard/jwt-guard';

@Controller({
  path: 'files',
  version: '1',
})
@ApiTags('Files')
export class FileController {
  constructor(public service: FileService) {}

  /**
   * General API for uploading file to AWS Bucket
   */
  // @Roles(AppRoles.DEFAULT)
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Upload an image' })
  @ApiResponse({ status: 201, description: 'Successful Upload' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilterUtils,
    }),
  )
  async createFile(@UploadedFile() file: Express.Multer.File) {
    const image = {
      name: file.originalname,
      path: '',
      mimeType: file.mimetype,
      size: 0,
      buffer: file.buffer,
    };
    return await this.service.uploadImage(image);
  }
}
