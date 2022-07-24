import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entity/common.entity';
import { FileEntity } from '../../file/entity/file.entity';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity({
  name: 'categories',
})
export class CategoryEntity extends CommonEntity {
  /**
   * Chapter name column
   */
  @Column({ length: 255 })
  name: string;

  /**
   * Chapter name column
   */
  @IsOptional({ groups: [UPDATE, CREATE] })
  @IsString({ always: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Thumbnail Colum
   */
  @Index('category-tb-index')
  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: 'thumbnailId' })
  thumbnail: string;
}
