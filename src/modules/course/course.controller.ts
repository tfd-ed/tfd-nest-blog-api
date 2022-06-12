import { Body, Controller, Post, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { Crud, CrudController } from '@nestjsx/crud';
import { CourseEntity } from './entity/course.entity';
import { ForbiddenDto } from '../common/schema/forbidden.dto';
import { PurchasePayload } from './payload/purchase.payload';

@Crud({
  model: {
    type: CourseEntity,
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
}
