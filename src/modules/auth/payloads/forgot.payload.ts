import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPayload {
  @ApiProperty({
    required: true,
    example: 'kimangkheang@gmail.com',
  })
  @IsEmail()
  email: string;
}
