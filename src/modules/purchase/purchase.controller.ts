import { Crud, CrudController } from '@nestjsx/crud';
import { PurchaseEntity } from './entity/purchase.entity';
import { PurchaseService } from './purchase.service';
import {
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import { ForbiddenDto } from '../common/schema/forbidden.dto';
import { JwtAuthGuard } from '../common/guard/jwt-guard';
import { RolesGuard } from '../common/guard/roles.guard';

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
  path: 'purchases',
  version: '1',
})
@ApiTags('Purchases')
@ApiBearerAuth()
@Roles(AppRoles.ADMINS)
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchaseController implements CrudController<PurchaseEntity> {
  constructor(public service: PurchaseService) {}
  /**
   * Approve a purchase and inform buyer via email and web shocked
   * @param id
   */
  @Patch(':id/approve')
  @ApiOperation({ summary: 'Admin approves a purchase' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenDto,
  })
  async approvePurchase(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.approvePurchase(id);
  }
}
