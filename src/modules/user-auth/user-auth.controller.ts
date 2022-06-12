import { ApiForbiddenResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterPayload } from './payloads/register.payload';
import { Public } from '../common/decorator/public.decorator';
import { ForbiddenDto } from '../common/schema/forbidden.dto';
import { UserAuthService } from './user-auth.service';
import { ConfirmEmail } from './payloads/confirmEmail.payload';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller({
  path: 'user-auth',
  version: '1',
})
@ApiTags('User Auth')
export class UserAuthController {
  constructor(public service: UserAuthService) {}

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
    return this.service.register(payload, i18n.lang);
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
    const email = await this.service.decodeConfirmationToken(
      payload.token,
      i18n,
    );
    return await this.service.confirmEmail(email, i18n);
  }
}
