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
   * On Course
   */
  @ManyToOne(() => CourseEntity)
  course: string;
  /**
   * Description column
   */
  @Column({ type: 'text' })
  description: string;

  /**
   * Video URL colum
   */
  @Column()
  url: string;
}
