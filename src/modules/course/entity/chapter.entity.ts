import { CommonEntity } from '../../common/entity/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CourseEntity } from './course.entity';

@Entity({
  name: 'chapters',
})
export class ChapterEntity extends CommonEntity {
  /**
   * Chapter name column
   */
  @Column({ length: 255 })
  name: string;

  /**
   * chapter Number ( For displaying chapter in order)
   */
  @Column({ type: 'int' })
  chapterNumber: number;

  /**
   * On Course
   */
  @ManyToOne(() => CourseEntity)
  course: string;
  /**
   * Description column
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Generic URL in case Vimeo not available
   */
  @Column({ nullable: true })
  url: string;

  /**
   * Vimeo ID
   */
  @Column({ nullable: true })
  vimeoId: string;
}
