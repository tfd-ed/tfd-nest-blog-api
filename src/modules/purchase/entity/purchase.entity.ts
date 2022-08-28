import { CommonEntity } from '../../common/entity/common.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CourseEntity } from '../../course/entity/course.entity';
import { PurchaseEnum } from '../../common/enum/purchase.enum';
import { FileEntity } from '../../file/entity/file.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({
  name: 'purchases',
})
export class PurchaseEntity extends CommonEntity {
  /**
   * purchase belongs to a user
   */
  @Index()
  @ManyToOne(() => UserEntity, (user) => user.purchases)
  @JoinColumn({ name: 'byUserId' })
  byUser: string;

  /**
   * On Course
   */
  @Index()
  @ManyToOne(() => CourseEntity, (course) => course.purchases)
  @JoinColumn({ name: 'courseId' })
  course: string;

  /**
   * Description column
   */
  @Column({ type: 'enum', enum: PurchaseEnum, default: PurchaseEnum.SUBMITTED })
  status: PurchaseEnum;

  /**
   * Price in $
   */
  @Column({ type: 'float' })
  price: number;

  /**
   * Bank transfer screenshot attachment
   */
  @ManyToOne(() => FileEntity)
  proofOfPayment: string;

  /**
   * transaction ID in ABA for reference
   */
  @Column({ type: 'text', nullable: true })
  transaction: string;
}
