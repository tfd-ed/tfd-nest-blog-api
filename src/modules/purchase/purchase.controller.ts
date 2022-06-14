import { Crud, CrudController } from '@nestjsx/crud';
import { PurchaseEntity } from '../course/entity/purchase.entity';
import { PurchaseService } from './purchase.service';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: PurchaseEntity,
  },
})
@Controller({
  path: 'purchase',
  version: '1',
})
@ApiTags('Purchase')
@ApiBearerAuth()
export class PurchaseController implements CrudController<PurchaseEntity> {
  constructor(public service: PurchaseService) {}
}
