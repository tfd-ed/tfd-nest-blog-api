import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResetPayload {
  @ApiProperty({
    required: true,
    example: 'kimangkheang@gmail.com',
  })
  @IsEmail()
  email: string;
}
