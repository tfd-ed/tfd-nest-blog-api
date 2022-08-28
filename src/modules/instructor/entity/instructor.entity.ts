import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { CourseEntity } from '../../course/entity/course.entity';
import { CommonEntity } from '../../common/entity/common.entity';
import { FileEntity } from '../../file/entity/file.entity';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity({
  name: 'instructors',
})
export class InstructorEntity extends CommonEntity {
  /**
   * Instructed courses List
   */
  @OneToMany(() => CourseEntity, (course) => course.instructor)
  instructedCourses: string[];

  /**
   * Biography can be rich text
   */
  @IsOptional({ groups: [UPDATE, CREATE] })
  @IsString({ always: true })
  @Column({ type: 'text', nullable: true })
  biography: string;

  /**
   * Name Column
   */
  @Column({ type: 'text' })
  name: string;

  /**
   * DoB colum
   */
  @IsOptional({ groups: [UPDATE, CREATE] })
  @Column({ type: 'date', nullable: true })
  dateOfBirth: string;

  /**
   * Instructor Profile
   */
  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'profileId' })
  @Type((t) => FileEntity)
  profile: string;
}
