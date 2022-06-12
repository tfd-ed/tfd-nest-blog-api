import { Entity, Column } from 'typeorm';
import { CommonEntity } from '../../common/entity/common.entity';

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
  @Column({ type: 'text' })
  description: string;

  /**
   * Instructor colum
   */
  @Column({ type: 'text', unique: true })
  instructor: string;
}
