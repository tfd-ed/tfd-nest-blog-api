import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import { Crud, CrudController } from '@nestjsx/crud';
import { InstructorEntity } from './entity/instructor.entity';
import { InstructorService } from './instructor.service';

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
@Roles(AppRoles.ADMINS)
@ApiBearerAuth()
export class InstructorController implements CrudController<InstructorEntity> {
  /**
   * User controller constructor
   * @param service
   */
  constructor(public service: InstructorService) {}
}