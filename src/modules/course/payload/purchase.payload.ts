import { IsNotEmpty, IsUUID, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PurchasePayload {
  @ApiProperty({
    required: true,
  })
  @IsUUID()
  byUserId: string;

  @ApiProperty({
    required: true,
  })
  @IsUUID()
  courseId: string;

  @ApiProperty({
    required: true,
  })
  @IsPositive()
  price: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  transaction: string;
}
