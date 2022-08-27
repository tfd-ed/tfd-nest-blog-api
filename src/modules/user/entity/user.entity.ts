import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PasswordTransformer } from '../password.transformer';
import { AppRoles } from '../../common/enum/roles.enum';
import { CommonEntity } from '../../common/entity/common.entity';
import { PurchaseEntity } from '../../purchase/entity/purchase.entity';
import { UserStatus } from '../../common/enum/userStatus.enum';
import { CourseEntity } from '../../course/entity/course.entity';
import { FileEntity } from '../../file/entity/file.entity';
import { Type } from 'class-transformer';

@Entity({
  name: 'users',
})
export class UserEntity extends CommonEntity {
  /**
   * Unique username column
   */
  @Column({ length: 255, unique: true })
  username: string;

  /**
   * FirstName column
   */
  @Column({ length: 255 })
  firstname: string;

  /**
   * LastName column
   */
  @Column({ length: 255 })
  lastname: string;

  /**
   * Email colum
   */
  @Column({ type: 'text', unique: true })
  email: string;

  /**
   * DoB colum
   */
  @Column({ type: 'date', nullable: true })
  dateOfBirth: string;

  /**
   * User status
   */
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.UNCONFIRMED })
  status: string;

  /**
   * User Profile
   */
  @Index('user-tb-index')
  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: 'profileId' })
  @Type((t) => FileEntity)
  profile: string;

  /**
   * Purchase List
   */
  @OneToMany(() => PurchaseEntity, (purchase) => purchase.byUser)
  purchases: string[];

  @Column({
    type: 'simple-array',
    enum: AppRoles,
    default: AppRoles.DEFAULT,
  })
  roles: AppRoles[];

  /**
   * Password column
   */
  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  password: string;

  /**
   * Omit password from query selection
   */
  toJSON() {
    const { password, ...self } = this;
    return self;
  }
}
