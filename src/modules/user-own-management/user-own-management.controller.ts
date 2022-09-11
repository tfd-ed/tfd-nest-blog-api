import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';
import { UserEntity } from '../user/entity/user.entity';
import { UserStatus } from '../common/enum/userStatus.enum';
import { UserOwnManagementService } from './user-own-management.service';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';

/**
 * This route is for non admin user only
 */
@Controller({
  path: 'user-own-management',
  version: '1',
})
@Crud({
  model: {
    type: UserEntity,
  },
  query: {
    join: {
      profile: {
        eager: false,
      },
    },
    exclude: ['password'],
    /**
     * Only published courses are shown to general users
     */
    filter: [{ field: 'status', operator: '$eq', value: UserStatus.ACTIVE }],
  },
  routes: {
    /**
     * Disable CRUD features for general users
     */
    exclude: [
      'deleteOneBase',
      'replaceOneBase',
      'createManyBase',
      'createOneBase',
      'getManyBase',
    ],
  },
})
@CrudAuth({
  property: 'user',
  filter: (user: UserEntity) => ({
    id: user.id,
  }),
})
@ApiTags('User Own Management')
@Roles(AppRoles.DEFAULT)
@ApiBearerAuth()
export class UserOwnManagementController implements CrudController<UserEntity> {
  constructor(public service: UserOwnManagementService) {}
}
