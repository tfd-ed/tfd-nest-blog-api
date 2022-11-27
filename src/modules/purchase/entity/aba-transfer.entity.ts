import { CommonEntity } from '../../common/entity/common.entity';
import { Column, Entity } from 'typeorm';

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
  @Column({ type: 'text', nullable: true })
  transaction: string;
}
