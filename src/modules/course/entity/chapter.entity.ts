import { CommonEntity } from '../../common/entity/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CourseEntity } from './course.entity';

/**
 * NestJS CRUD
 */
import { CrudValidationGroups } from '@nestjsx/crud';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity({
  name: 'chapters',
})
export class ChapterEntity extends CommonEntity {
  /**
   * Chapter name column
   */
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 255 })
  name: string;

  /**
   * chapter Number ( For displaying chapter in order)
   */
  @Column({ type: 'int' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsInt({ groups: [CREATE, UPDATE] })
  chapterNumber: number;

  /**
   * On Course
   */
  @ManyToOne(() => CourseEntity, (course) => course.chapters)
  @JoinColumn({ name: 'courseId' })
  course: string;
  /**
   * Description column
   */
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Generic URL in case Vimeo not available
   */
  @IsOptional({ groups: [UPDATE] })
  @Column({ nullable: true })
  url: string;

  /**
   * Vimeo ID
   */
  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ nullable: true })
  vimeoId: string;

  /**
   * Course duration in second
   */
  @IsOptional({ always: true })
  @IsInt({ always: true })
  @Column({ type: 'int' })
  duration: number;
}
