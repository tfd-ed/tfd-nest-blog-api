import { ApiProperty } from '@nestjs/swagger';

export class DateDto {
  @ApiProperty()
  createdDate: Date;
  @ApiProperty()
  updatedDate: Date;
  @ApiProperty()
  deletedDate: Date;
}
