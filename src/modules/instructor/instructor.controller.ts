import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { InstructorEntity } from './entity/instructor.entity';
import { InstructorService } from './instructor.service';
import { JwtAuthGuard } from '../common/guard/jwt-guard';
import { NoCache } from '../common/decorator/no-cache.decorator';

@Crud({
  model: {
    type: InstructorEntity,
  },
  query: {
    join: {
      instructedCourses: {
        eager: false,
      },
      profile: {
        eager: false,
      },
    },
  },
})
@Controller({
  path: 'instructors',
  version: '1',
})
@ApiTags('Instructors')
// @Roles(AppRoles.ADMINS)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class InstructorController implements CrudController<InstructorEntity> {
  /**
   * User controller constructor
   * @param service
   */
  constructor(public service: InstructorService) {}

  get base(): CrudController<InstructorEntity> {
    return this;
  }

  @NoCache()
  @Override('getOneBase')
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @NoCache()
  @Override('getManyBase')
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }
}
