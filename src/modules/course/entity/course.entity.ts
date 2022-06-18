import {
  Entity,
  Column,
  JoinColumn,
  Index,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { CommonEntity } from '../../common/entity/common.entity';
import { FileEntity } from '../../file/entity/file.entity';
import { ChapterEntity } from './chapter.entity';
import { PurchaseEntity } from './purchase.entity';

@Entity({
  name: 'courses',
})
export class CourseEntity extends CommonEntity {
  /**
   * Unique title column
   */
  @Column({ length: 255, unique: true })
  title: string;

  /**
   * Description column
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Instructor colum
   */
  @Column({ type: 'text', unique: true })
  instructor: string;

  /**
   * Price Colum
   */
  @Column({ type: 'float' })
  price: number;

  /**
   * Thumbnail Colum
   */
  @Index('course-tb-index')
  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: 'thumbnailId' })
  thumbnail: string;

  /**
   * Chapter list
   */
  @OneToMany(() => ChapterEntity, (chapter) => chapter.course, {
    nullable: true,
    eager: true,
  })
  chapters: string[];

  /**
   * Purchase List
   */
  @OneToMany(() => PurchaseEntity, (purchase) => purchase.course)
  purchases: string[];

  /**
   * Link to Pay way
   */
  @Column({ type: 'text' })
  paymentLink: string;
}
