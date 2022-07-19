import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
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
import { Public } from '../common/decorator/public.decorator';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import { ChapterPayload } from './payload/chapter.payload';

@Crud({
  model: {
    type: CourseEntity,
  },
  query: {
    join: {
      category: {
        eager: false,
      },
      thumbnail: {
        eager: false,
      },
      chapters: {
        eager: false,
      },
      purchases: {
        eager: false,
      },
    },
  },
})
@Controller({
  path: 'course',
  version: '1',
})
@ApiTags('Course')
@ApiBearerAuth()
export class CourseController implements CrudController<CourseEntity> {
  constructor(public service: CourseService) {}

  /**
   * User purchase a course
   * @param id
   * @param payload
   */
  // @ApiBearerAuth()
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

  /**
   * Check past purchase
   * @param id
   * @param userId
   */
  // @ApiBearerAuth()
  @Get(':id/user-purchase/:userId')
  @ApiOperation({ summary: 'User purchase a course' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenDto,
  })
  async pastPurchase(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return this.service.userPurchase(id, userId);
  }

  @Roles(AppRoles.ADMINS)
  @ApiOperation({ summary: 'Create new Chapter' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenDto,
  })
  @Post(':id/new-chapter')
  async newChapter(@Body() payload: ChapterPayload) {
    return this.service.newChapter(payload);
  }

  // @ApiBearerAuth()
  // @Public()
  // @Get(':id/chapters')
  // @ApiOperation({ summary: 'Retrieve all chapter' })
  // @ApiForbiddenResponse({
  //   status: 403,
  //   description: 'Forbidden',
  //   type: ForbiddenDto,
  // })
  // @ApiQuery({ name: 'page', required: true, example: '1' })
  // @ApiQuery({ name: 'limit', required: true, example: '10' })
  // async getChapters(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Query('page', ParseIntPipe) page = 1,
  //   @Query('limit', ParseIntPipe) limit = 10,
  // ) {
  //   limit = limit > 100 ? 100 : limit;
  //   return this.service.getChapters(id, {
  //     page,
  //     limit,
  //     paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
  //   });
  // }
  get base(): CrudController<CourseEntity> {
    return this;
  }

  /**
   * Override for public request
   * @param req
   */
  @Public()
  @Override('getManyBase')
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  /**
   * Override for auth
   * @param req
   */
  @Public()
  @Override('getOneBase')
  getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }
}
