import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { SameAs } from '../../common/validator/same-as.validator';

export class RegisterPayload {
  @ApiProperty({
    required: true,
    example: 'KimAng',
  })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    required: true,
    example: 'Kheang',
  })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    required: true,
    example: 'kimangkheang@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @ApiProperty({ required: true })
  @SameAs('password')
  passwordConfirmation: string;
}
