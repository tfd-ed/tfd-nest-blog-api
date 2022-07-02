import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entity/common.entity';
import { FileEntity } from '../../file/entity/file.entity';

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
  @Column({ length: 255 })
  description: string;

  /**
   * Thumbnail Colum
   */
  @Index('category-tb-index')
  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: 'thumbnailId' })
  thumbnail: string;
}
