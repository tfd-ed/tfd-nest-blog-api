import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import { CourseEntity } from '../course/entity/course.entity';
import { CourseManagementService } from './course-management.service';
import { JwtAuthGuard } from '../common/guard/jwt-guard';
import { RolesGuard } from '../common/guard/roles.guard';

/**
 * This route is for admin user only
 */
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
}
