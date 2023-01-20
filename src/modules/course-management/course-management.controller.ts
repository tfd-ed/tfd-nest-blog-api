import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import { CourseEntity } from '../course/entity/course.entity';
import { CourseManagementService } from './course-management.service';
import { JwtAuthGuard } from '../common/guard/jwt-guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { NoCache } from '../common/decorator/no-cache.decorator';
import { SkipThrottle } from '@nestjs/throttler';

/**
 * This route is for admin user only
 */
@SkipThrottle()
@Controller({
  path: 'courses-management',
  version: '1',
})
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
      instructor: {
        eager: false,
      },
    },
  },
})
@Roles(AppRoles.ADMINS)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Courses Management')
@ApiBearerAuth()
export class CourseManagementController
  implements CrudController<CourseEntity>
{
  constructor(public service: CourseManagementService) {}

  get base(): CrudController<CourseEntity> {
    return this;
  }

  @NoCache()
  @Override('getManyBase')
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @NoCache()
  @Override('getOneBase')
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }
}
