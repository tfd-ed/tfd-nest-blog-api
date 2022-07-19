import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { PurchaseEntity } from '../course/entity/purchase.entity';
import { PurchaseService } from './purchase.service';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';

@Crud({
  model: {
    type: PurchaseEntity,
  },
  query: {
    join: {
      byUser: {
        eager: false,
      },
      course: {
        eager: false,
      },
    },
  },
})
@Controller({
  path: 'purchase',
  version: '1',
})
@ApiTags('Purchase')
@ApiBearerAuth()
@Roles(AppRoles.ADMINS)
export class PurchaseController implements CrudController<PurchaseEntity> {
  constructor(public service: PurchaseService) {}
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
