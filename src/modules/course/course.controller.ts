import {
  Body,
  Controller,
  Post,
  Param,
  ParseUUIDPipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CourseService } from './course.service';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { CourseEntity } from './entity/course.entity';
import { ForbiddenDto } from '../common/schema/forbidden.dto';
import { PurchasePayload } from './payload/purchase.payload';
import { PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { Public } from '../common/decorator/public.decorator';

@Crud({
  model: {
    type: CourseEntity,
  },
  query: {
    join: {
      category: {
        eager: true,
      },
      thumbnail: {
        eager: true,
      },
    },
  },
})
@Controller({
  path: 'course',
  version: '1',
})
@ApiTags('Course')
export class CourseController implements CrudController<CourseEntity> {
  constructor(public service: CourseService) {}

  /**
   * User purchase a course
   * @param id
   * @param payload
   */
  @ApiBearerAuth()
  @Post(':id/purchase')
  @ApiOperation({ summary: 'User purchase a course' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenDto,
  })
  async purchase(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: PurchasePayload,
  ) {
    return this.service.purchase(id, payload);
  }

  @ApiBearerAuth()
  @Get(':id/chapters')
  @ApiOperation({ summary: 'Retrives all chapter' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenDto,
  })
  @ApiQuery({ name: 'page', required: true, example: '1' })
  @ApiQuery({ name: 'limit', required: true, example: '10' })
  async getChapters(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.service.getChapters(id, {
      page,
      limit,
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
    });
  }
  get base(): CrudController<CourseEntity> {
    return this;
  }

  /**
   * Override for public request
   * @param req
   */
  @Public()
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }
}
