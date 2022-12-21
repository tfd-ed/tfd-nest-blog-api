import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { JwtAuthGuard } from '../common/guard/jwt-guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { NoCache } from '../common/decorator/no-cache.decorator';

@Crud({
  model: {
    type: UserEntity,
  },
  query: {
    join: {
      purchases: {
        eager: false,
      },
      profile: {
        eager: false,
      },
    },
    exclude: ['password', 'refreshToken'],
  },
  routes: {
    exclude: ['deleteOneBase'],
  },
})
@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('Users')
@Roles(AppRoles.ADMINS)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController implements CrudController<UserEntity> {
  /**
   * User controller constructor
   * @param service
   */
  constructor(public service: UsersService) {}

  get base(): CrudController<UserEntity> {
    return this;
  }

  @NoCache()
  @Override('getManyBase')
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @NoCache()
  @Override('getOneBase')
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }
}
