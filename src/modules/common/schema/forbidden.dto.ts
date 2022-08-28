import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenDto {
  @ApiProperty({ example: '403' })
  statusCode: number;
  @ApiProperty({ example: 'Forbidden resource' })
  message: string;
  @ApiProperty({ example: 'Forbidden' })
  error: string;
}
