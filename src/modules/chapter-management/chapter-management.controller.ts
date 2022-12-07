import { Crud, CrudController } from '@nestjsx/crud';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import { ChapterEntity } from './entity/chapter.entity';
import { ChapterManagementService } from './chapter-management.service';

@Crud({
  model: {
    type: ChapterEntity,
  },
})
@Controller({
  path: 'chapters-management',
  version: '1',
})
@ApiTags('Chapters Management')
@ApiBearerAuth()
@Roles(AppRoles.ADMINS)
export class ChapterManagementController
  implements CrudController<ChapterEntity>
{
  constructor(public service: ChapterManagementService) {}
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
