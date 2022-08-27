import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { Roles } from '../common/decorator/roles.decorator';
import { AppRoles } from '../common/enum/roles.enum';
import { Crud, CrudAuth, CrudController } from '@nestjsx/crud';

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
})
@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('Users')
@Roles(AppRoles.ADMINS)
@ApiBearerAuth()
export class UserController implements CrudController<UserEntity> {
  /**
   * User controller constructor
   * @param service
   */
  constructor(public service: UsersService) {}
  //
  // /**
  //  * Public endpoints (Marked by @Public() ) all users with pagination options
  //  * @param page page number
  //  * @param limit items limit
  //  */
  // @Get()
  // @ApiQuery({ name: 'page', required: true, example: '0' })
  // @ApiQuery({ name: 'limit', required: true, example: '0' })
  // @ApiResponse({ status: 200, description: 'Successful Request' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async getAll(
  //   @Query('page', ParseIntPipe) page = 1,
  //   @Query('limit', ParseIntPipe) limit = 10,
  // ): Promise<Pagination<UserEntity>> {
  //   limit = limit > 100 ? 100 : limit;
  //   return await this.userService.getAll({
  //     page,
  //     limit,
  //   });
  // }
  //
  // /**
  //  * Get user by id
  //  * @param id id in UUID
  //  */
  // @Get(':id')
  // @ApiResponse({ status: 200, description: 'Successful ' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async getUserById(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  // ): Promise<any> {
  //   return await this.userService.get(id);
  // }
  //
  // /**
  //  * Get course by user id
  //  * @param id id in UUID
  //  * @param page
  //  * @param limit
  //  */
  //
  // @Get(':id/courses')
  // @ApiResponse({ status: 200, description: 'Successful ' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // @ApiQuery({ name: 'page', required: true, example: '1' })
  // @ApiQuery({ name: 'limit', required: true, example: '10' })
  // async getCourseByUserId(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Query('page', ParseIntPipe) page = 1,
  //   @Query('limit', ParseIntPipe) limit = 10,
  // ): Promise<any> {
  //   limit = limit > 100 ? 100 : limit;
  //   return await this.userService.getCourse(id, {
  //     page,
  //     limit,
  //     paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
  //   });
  // }
  //
  // /**
  //  * Update user by Id
  //  * @param id id in UUID
  //  * @param updatePayload update payload with optional parameters
  //  */
  // @Put(':id')
  // @ApiResponse({ status: 200, description: 'Successful ' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async update(
  //   @Param('id', new ParseUUIDPipe()) id: string,
  //   @Body() updatePayload: UpdatePayload,
  // ): Promise<any> {
  //   return await this.userService.update(id, updatePayload);
  // }
  //
  // /**
  //  * Delete user by Id
  //  * @param id id in UUID
  //  */
  // @Roles(AppRoles.ADMINS)
  // @Delete(':id')
  // @ApiResponse({ status: 200, description: 'Delete Profile Request Received' })
  // @ApiResponse({ status: 400, description: 'Delete Profile Request Failed' })
  // async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<any> {
  //   return await this.userService.delete(id);
  // }
}
