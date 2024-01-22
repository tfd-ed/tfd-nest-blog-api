import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { UserEntity } from '../user/entity/user.entity';
import { UserOwnManagementService } from './user-own-management.service';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import { JwtAuthGuard } from '../common/guard/jwt-guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { NoCache } from '../common/decorator/no-cache.decorator';
import { UsersService } from '../user/user.service';
import { ForbiddenDto } from '../common/schema/forbidden.dto';

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
    exclude: ['password', 'refreshToken'],
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
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserOwnManagementController implements CrudController<UserEntity> {
  constructor(
    public service: UserOwnManagementService,
    private readonly userService: UsersService,
  ) {}

  get base(): CrudController<UserEntity> {
    return this;
  }

  @NoCache()
  @Override('getOneBase')
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  /**
   * In case user update username which may be duplicated with other username
   * Throw bad request exception
   * @param req
   * @param dto
   */
  @Override('updateOneBase')
  async updateUser(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: UserEntity,
  ) {
    try {
      await this.base.updateOneBase(req, dto);
      // await this.cacheManager.del();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @ApiOperation({ summary: 'User get his integration info' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenDto,
  })
  @Get(':id/integrations')
  async getIntegrations(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.getIntegrationById(id);
  }
}
