import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterPayload {
  @ApiProperty({
    required: true,
    example: 'KimAng',
  })
  @IsNotEmpty()
  public firstname: string;

  @ApiProperty({
    required: true,
    example: 'Kheang',
  })
  @IsNotEmpty()
  public lastname: string;

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email: string;
}
