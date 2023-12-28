import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmail {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
