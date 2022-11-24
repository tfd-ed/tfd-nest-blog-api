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

import { CourseEnum } from '../common/enum/course.enum';
import { CourseTypeEnum } from '../common/enum/course-type.enum';
import { PurchaseService } from '../purchase/purchase.service';

/**
 * This route is for non admin user only
 */
@Controller({
  path: 'courses',
  version: '1',
})
@Crud({
  model: {
    type: CourseEntity,
  },
  params: {
    titleURL: {
      field: 'titleURL',
      type: 'string',
      primary: true,
    },
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
      instructor: {
        eager: false,
      },
    },
    /**
     * Only published courses are shown to general users
     */
    filter: [{ field: 'status', operator: '$eq', value: CourseEnum.PUBLISHED }],
  },
  routes: {
    /**
     * Disable CRUD features for general users
     */
    exclude: [
      'deleteOneBase',
      'updateOneBase',
      'replaceOneBase',
      'createManyBase',
      'createOneBase',
    ],
  },
})
@ApiTags('Courses')
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
    return await this.service.purchase(id, payload);
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
