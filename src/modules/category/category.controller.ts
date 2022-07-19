import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { CategoryEntity } from './entity/category.entity';
import { CategoryService } from './category.service';
import { Public } from '../common/decorator/public.decorator';

@Crud({
  model: {
    type: CategoryEntity,
  },
})
@Controller({
  path: 'category',
  version: '1',
})
@ApiTags('Category')
@ApiBearerAuth()
export class CategoryController implements CrudController<CategoryEntity> {
  constructor(public service: CategoryService) {}

  get base(): CrudController<CategoryEntity> {
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
}
