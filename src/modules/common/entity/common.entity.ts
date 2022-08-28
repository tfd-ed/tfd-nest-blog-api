import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Most common entity for course, user, and more
 * Provide all entity with id, created, deleted, and updated date
 */
@Entity()
export abstract class CommonEntity {
  /**
   * UUID column
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * created date column
   */
  @CreateDateColumn()
  createdDate: Date;

  /**
   * updated date column
   */
  @UpdateDateColumn()
  updatedDate: Date;

  /**
   * delete date column
   */
  @DeleteDateColumn()
  deletedDate: Date;
}
