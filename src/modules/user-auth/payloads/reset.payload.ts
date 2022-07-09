import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { SameAs } from '../../common/validator/same-as.validator';

export class ResetPayload {
  @ApiProperty({
    required: true,
    example: 'kimangkheang@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: 'sdf23t2nfs',
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    required: true,
  })
  @MinLength(8)
  password: string;

  @ApiProperty({
    required: true,
  })
  @SameAs('password')
  confirmation: string;
}
