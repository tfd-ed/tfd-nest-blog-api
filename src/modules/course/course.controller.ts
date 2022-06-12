import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { Crud, CrudController } from '@nestjsx/crud';
import { CourseEntity } from './entity/course.entity';

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
}
