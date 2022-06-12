import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  Index,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from '../../common/entity/common.entity';
import { FileEntity } from '../../file/entity/file.entity';
import { ChapterEntity } from './chapter.entity';

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
  @Column()
  price: number;

  /**
   * Thumbnail Colum
   */
  @Index('course-tb-index')
  @OneToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'thumbnailId' })
  thumbnail: string;

  /**
   * Chapter list
   */
  @OneToMany(() => ChapterEntity, (chapter) => chapter.course)
  chapter: ChapterEntity[];

  /**
   * Link to Pay way
   */
  @Column({ type: 'text' })
  paymentLink: string;
}
