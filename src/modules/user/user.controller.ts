import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from '../common/guard/jwt-guard';

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
    exclude: ['password'],
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
@UseGuards(JwtAuthGuard)
export class UserController implements CrudController<UserEntity> {
  /**
   * User controller constructor
   * @param service
   */
  constructor(public service: UsersService) {}
}
