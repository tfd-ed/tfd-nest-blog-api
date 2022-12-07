import { IsNotEmpty, IsUUID, IsPositive, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PurchasePayload {
  @ApiProperty({
    required: true,
  })
  @IsUUID()
  byUser: string;

  @ApiProperty({
    required: true,
  })
  @IsUUID()
  course: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  transaction: string;
}
