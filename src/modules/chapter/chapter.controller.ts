import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import { ChapterEntity } from '../course/entity/chapter.entity';
import { ChapterService } from './chapter.service';

@Crud({
  model: {
    type: ChapterEntity,
  },
})
@Controller({
  path: 'chapter',
  version: '1',
})
@ApiTags('Chapters')
@ApiBearerAuth()
@Roles(AppRoles.ADMINS)
export class ChapterController implements CrudController<ChapterEntity> {
  constructor(public service: ChapterService) {}
  // get base(): CrudController<PurchaseEntity> {
  //   return this;
  // }
  //
  // /**
  //  * Override for public request
  //  * @param req
  //  */
  // @Override('getManyBase')
  // getMany(@ParsedRequest() req: CrudRequest) {
  //   return this.base.getManyBase(req);
  // }
}
