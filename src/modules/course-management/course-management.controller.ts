import { Controller } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import { CourseEntity } from '../course/entity/course.entity';
import { CourseManagementService } from './course-management.service';
import { Public } from '../common/decorator/public.decorator';
import { ForbiddenDto } from '../common/schema/forbidden.dto';
import { RegisterPayload } from '../user-auth/payloads/register.payload';
import { I18n, I18nContext } from 'nestjs-i18n';

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
@ApiTags('Courses Management')
@ApiBearerAuth()
export class CourseManagementController
  implements CrudController<CourseEntity>
{
  constructor(public service: CourseManagementService) {}
}
