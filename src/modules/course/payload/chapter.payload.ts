import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class ChapterPayload {
  @ApiProperty({
    required: true,
  })
  @IsUUID()
  name: string;

  @ApiProperty({
    required: true,
  })
  @IsInt()
  chapterNumber: number;

  @ApiProperty({
    required: true,
  })
  @IsUUID()
  course: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  url: string;

  @ApiProperty({
    required: false,
    description: 'Vimeo video ID',
  })
  @IsOptional()
  vimeoId: string;

  /**
   * Duration in second
   */
  @ApiProperty({
    required: true,
    description: 'Chapter duration in second',
  })
  @IsInt()
  duration: number;
}
