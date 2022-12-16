import { Column, Entity, Index } from 'typeorm';
import { CommonEntity } from '../../common/entity/common.entity';

@Entity({
  name: 'forgot-password-tokens',
})
export class ForgotEntity extends CommonEntity {
  /**
   * Email colum
   */
  @Column({ type: 'text' })
  email: string;

  /**
   * Token for storing 2nd verification
   */
  @Index('reset-token-index')
  @Column({ type: 'text' })
  token: string;

  /**
   * If the reset is done
   */
  @Column({ type: 'boolean', default: false })
  done: boolean;
}
