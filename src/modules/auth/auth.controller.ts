import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Public } from '../common/decorator/public.decorator';
import { AuthService } from './auth.service';
import { LoginPayload } from './payloads/login.payload';
import { ResetPayload } from './payloads/reset.payload';
import { UsersService } from '../user/user.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ForbiddenDto } from '../common/schema/forbidden.dto';
import { RegisterPayload } from '../user-auth/payloads/register.payload';
import { ConfirmEmail } from '../user-auth/payloads/confirmEmail.payload';
import { ForgotPayload } from '../user-auth/payloads/forgot.payload';
// import { Request } from 'express';
import { RefreshTokenGuard } from '../common/guard/refresh-guard';
import RequestWithUser from '../common/interface/request-with-user.interface';
import { JwtAuthGuard } from '../common/guard/jwt-guard';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Authentication')
export class AuthController {
  /**
   * Constructor
   * @param authService auth service
   * @param userService user service
   */
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  /**
   * Login User
   * @param payload email, password
   * @param i18n
   * @return {token} including expire time, jwt token and user info
   */
  @Public()
  @Post('login')
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(
    @Body() payload: LoginPayload,
    @I18n() i18n: I18nContext,
  ): Promise<any> {
    const user = await this.authService.validateUser(payload, i18n);

    // return await this.authService.createToken(user);
    const tokens = await this.authService.getTokens(user.id);
    this.authService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  /**
   * Login Admin User
   * @param payload email, password
   * @param i18n
   * @return {token} including expire time, jwt token and user info
   */
  @Public()
  @Post('admin-login')
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async adminLogin(
    @Body() payload: LoginPayload,
    @I18n() i18n: I18nContext,
  ): Promise<any> {
    const user = await this.authService.validateAdmin(payload, i18n);
    const tokens = await this.authService.getTokens(user.id);
    this.authService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
    // return await this.authService.createToken(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @ApiResponse({ status: 201, description: 'Successful Request' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Req() req: RequestWithUser) {
    await this.authService.logout(req.user['id']);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiResponse({ status: 201, description: 'Successful Request' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  refreshTokens(@Req() req: RequestWithUser) {
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  // /**
  //  * Change user password
  //  * @param payload change password payload
  //  */
  // @Public()
  // @Post('changePassword')
  // @ApiResponse({ status: 201, description: 'Successful Reset' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async resetPassword(@Body() payload: ResetPayload): Promise<any> {
  //   const user = await this.userService.changPassword(payload);
  //   return user.toJSON();
  // }

  /**
   * Get request's user info
   * @param req
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoggedInUser(@Req() req: RequestWithUser): Promise<any> {
    return req.user;
  }

  /**
   * User requests to register
   * @param payload
   * @param i18n
   */
  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'Register a user and send mail verification' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenDto,
  })
  async registerUser(
    @Body() payload: RegisterPayload,
    @I18n() i18n: I18nContext,
  ) {
    return this.authService.register(payload, i18n);
  }
  /**
   * User request to confirm email address
   * @param payload
   * @param i18n
   */
  @Public()
  @Post('/confirm')
  @ApiOperation({ summary: 'User confirm his email address' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenDto,
  })
  async confirmEmail(@Body() payload: ConfirmEmail, @I18n() i18n: I18nContext) {
    const email = await this.authService.decodeConfirmationToken(
      payload.token,
      i18n,
    );
    return await this.authService.confirmEmail(email, i18n);
  }

  @Public()
  @Post('/forgot-password')
  @ApiOperation({ summary: 'User forgot password' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenDto,
  })
  async forgotPassword(
    @Body() payload: ForgotPayload,
    @I18n() i18n: I18nContext,
  ) {
    return this.authService.forgotPassword(payload.email, i18n);
  }

  @Public()
  @Post('/reset-password')
  @ApiOperation({ summary: 'User request to reset password' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenDto,
  })
  async resetPassword(
    @Body() payload: ResetPayload,
    @I18n() i18n: I18nContext,
  ) {
    return this.authService.resetPassword(payload, i18n);
  }

  @Public()
  @Get('/reset-token/:token')
  @ApiOperation({ summary: 'Verify if reset token is valid' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenDto,
  })
  async verifyResetToken(
    @Param('token') token: string,
    @I18n() i18n: I18nContext,
  ) {
    return await this.authService.verifyResetToken(token, i18n);
  }
}
