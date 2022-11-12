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
import { ChapterEntity } from '../../chapter/entity/chapter.entity';
import { PurchaseEntity } from '../../purchase/entity/purchase.entity';
import { CategoryEntity } from '../../category/entity/category.entity';
/**
 * NestJS CRUD
 */
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { InstructorEntity } from '../../instructor/entity/instructor.entity';
import { CourseEnum } from '../../common/enum/course.enum';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity({
  name: 'courses',
})
export class CourseEntity extends CommonEntity {
  /**
   * Unique title column
   */
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ length: 255, unique: true })
  title: string;

  /**
   * Short Description column
   */
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  /**
   * Description column
   */
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Instructor column
   */
  @Index('course-instructor-index')
  @Type(() => InstructorEntity)
  @ManyToOne(() => InstructorEntity, (user) => user.instructedCourses)
  @JoinColumn({ name: 'instructorId' })
  instructor: string;

  /**
   * Price Column
   */
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsNumber({ maxDecimalPlaces: 99999, allowInfinity: false, allowNaN: false })
  @Column({ type: 'float' })
  price: number;

  /**
   * Promotional Column
   */
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ type: 'text', nullable: true })
  promotionalVimeoLink: string;

  /**
   * Thumbnail Colum
   */
  @Index('course-tb-index')
  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: 'thumbnailId' })
  @Type((t) => FileEntity)
  thumbnail: string;

  /**
   * Category the course belong
   */
  @ManyToOne(() => CategoryEntity)
  @Type((t) => CategoryEntity)
  category: string;

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
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @Column({ type: 'text' })
  paymentLink: string;

  /**
   * Course duration in second
   */
  @Column({ type: 'int', nullable: true })
  duration: number;

  /**
   * Course Enum
   */
  @Column({ type: 'enum', enum: CourseEnum, default: CourseEnum.DRAFTED })
  status: string;
}
