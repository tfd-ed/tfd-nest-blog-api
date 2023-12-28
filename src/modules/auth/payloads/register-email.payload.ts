import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';
import { SameAs } from '../../common/validator/same-as.validator';
import { RegisterPayload } from './register.payload';

export class RegisterEmailPayload extends RegisterPayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  public password: string;

  @ApiProperty({ required: true })
  @SameAs('password')
  public passwordConfirmation: string;
}
