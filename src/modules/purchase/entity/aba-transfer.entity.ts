import { CommonEntity } from '../../common/entity/common.entity';
import { Column, Entity } from 'typeorm';
import { PaymentEnum } from '../../common/enum/payment.enum';

@Entity({
  name: 'aba-transfers',
})
/**
 * SAVE ABA purchase event
 */
export class AbaTransferEntity extends CommonEntity {
  /**
   * Price in $
   */
  @Column({ type: 'float' })
  price: number;

  /**
   * transaction ID in ABA for reference
   */
  @Column({ type: 'text', nullable: true, unique: true })
  transaction: string;

  /**
   * Status column
   */
  @Column({ type: 'enum', enum: PaymentEnum, default: PaymentEnum.PENDING })
  status: PaymentEnum;
}
