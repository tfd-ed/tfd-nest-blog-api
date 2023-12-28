import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../common/decorator/public.decorator';
import { AuthService } from './auth.service';
import { LoginPayload } from './payloads/login.payload';
import { ResetPayload } from './payloads/reset.payload';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ForbiddenDto } from '../common/schema/forbidden.dto';
import { RefreshTokenGuard } from '../common/guard/refresh-guard';
import RequestWithUser from '../common/interface/request-with-user.interface';
import { JwtAuthGuard } from '../common/guard/jwt-guard';
import { RegisterEmailPayload } from './payloads/register-email.payload';
import { ConfirmEmail } from './payloads/confirm-email.payload';
import { ForgotPayload } from './payloads/forgot.payload';
import { NoCache } from '../common/decorator/no-cache.decorator';
import { GoogleOauthGuard } from '../common/guard/google-oauth-guard';
import { FacebookGuard } from '../common/guard/facebook-guard';
import { GithubGuard } from '../common/guard/github-guard';
import { ProviderEnum } from '../common/enum/provider.enum';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOkResponse({ description: 'Successful Login' })
  @ApiBadRequestResponse({ description: 'Unsuccessful login' })
  async login(
    @Body() payload: LoginPayload,
    @I18n() i18n: I18nContext,
  ): Promise<any> {
    const user = await this.authService.validateUser(payload, i18n);

    // return await this.authService.createToken(user);
    const tokens = await this.authService.getTokens(user.id);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  @Public()
  @Post('admin-login')
  @ApiOkResponse({ description: 'Successful Login' })
  @ApiBadRequestResponse({ description: 'Unsuccessful login' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized login' })
  async adminLogin(
    @Body() payload: LoginPayload,
    @I18n() i18n: I18nContext,
  ): Promise<any> {
    const user = await this.authService.validateAdmin(payload, i18n);
    const tokens = await this.authService.getTokens(user.id);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @NoCache()
  @Get('logout')
  @ApiOkResponse({ status: 201, description: 'Successful logout' })
  async logout(@Req() req: RequestWithUser) {
    await this.authService.logout(req.user['id']);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @NoCache()
  @Get('refresh')
  async refreshTokens(@Req() req: RequestWithUser) {
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @NoCache()
  @Get('me')
  @ApiOkResponse({ description: 'Successful Response' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getLoggedInUser(@Req() req: RequestWithUser): Promise<any> {
    return req.user;
  }

  @UseGuards(GoogleOauthGuard)
  @NoCache()
  @Post('google/callback')
  async googleAuthCallback(@Req() req): Promise<any> {
    return this.authService.handleAuthCallback(
      req,
      ProviderEnum.GOOGLE,
      'firstname',
    );
  }

  @UseGuards(FacebookGuard)
  @NoCache()
  @Post('facebook/callback')
  async facebookAuthCallback(@Req() req): Promise<any> {
    return this.authService.handleAuthCallback(
      req,
      ProviderEnum.FACEBOOK,
      'firstname',
    );
  }

  @UseGuards(GithubGuard)
  @NoCache()
  @Post('github/callback')
  async githubAuthCallback(@Req() req): Promise<any> {
    return this.authService.handleAuthCallback(req, ProviderEnum.GITHUB);
  }

  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'Register a user and send mail verification' })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Forbidden',
    type: ForbiddenDto,
  })
  async registerUser(
    @Body() payload: RegisterEmailPayload,
    @I18n() i18n: I18nContext,
  ) {
    return this.authService.register(payload, i18n);
  }

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
  @NoCache()
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
