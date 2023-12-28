import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AppRoles } from '../../common/enum/roles.enum';
import { CommonEntity } from '../../common/entity/common.entity';
import { PurchaseEntity } from '../../purchase/entity/purchase.entity';
import { UserStatus } from '../../common/enum/user-status.enum';
import { FileEntity } from '../../file/entity/file.entity';
import { Type } from 'class-transformer';
import { UserTypeEnum } from '../../common/enum/user-type.enum';
import { PasswordTransformer } from '../password.transformer';
import { IntegrationEntity } from './integration.entity';

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
  @Column({ length: 255, nullable: true })
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
   * User registration type: email, Facebook, Google, or GitHub
   */
  @Column({ type: 'enum', enum: UserTypeEnum, default: UserTypeEnum.EMAIL })
  registrationType: string;

  @OneToMany(() => IntegrationEntity, (integration) => integration.byUser)
  integration: IntegrationEntity[];

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
    nullable: true,
    /**
     * Only use during fixture generation, should disable transformer when is not used
     */
    transformer: new PasswordTransformer(),
  })
  // @Exclude({
  //   toPlainOnly: false,
  //   toClassOnly: false,
  // })
  password: string;

  /**
   * Refresh Token
   */
  @Column({
    nullable: true,
  })
  // @Exclude()
  public refreshToken?: string;

  /**
   * Omit password from query selection
   */
  toJSON() {
    const { password, refreshToken, ...self } = this;
    return self;
  }
}
