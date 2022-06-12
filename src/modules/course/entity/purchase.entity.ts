import { CommonEntity } from '../../common/entity/common.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { UserEntity } from '../../user';
import { PurchaseEnum } from '../../common/enum/purchase.enum';
import { FileEntity } from '../../file/entity/file.entity';

@Entity({
  name: 'purchases',
})
export class PurchaseEntity extends CommonEntity {
  /**
   * purchase belongs to a user
   */
  @Index()
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'byUserId' })
  byUserId: string;

  /**
   * On Course
   */
  @Index()
  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: 'courseId' })
  courseId: string;

  /**
   * Description column
   */
  @Column({ type: 'enum', enum: PurchaseEnum, default: PurchaseEnum.SUBMITTED })
  status: PurchaseEnum;

  /**
   * Price in $
   */
  @Column()
  price: number;

  /**
   * Bank transfer screenshot attachment
   */
  @OneToOne(() => FileEntity)
  proofOfPayment: string;

  /**
   * transaction ID in ABA for reference
   */
  @Column({ type: 'text', nullable: true })
  transaction: string;
}
