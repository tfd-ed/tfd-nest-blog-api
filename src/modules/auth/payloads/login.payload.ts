import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginPayload {
  @ApiProperty({
    required: true,
    example: 'admin@tfdevs.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    required: true,
    example: 'adminpassword',
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
