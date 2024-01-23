import { ValueTransformer } from 'typeorm';
import { Hash } from '../../utils/Hash';

export class PasswordTransformer implements ValueTransformer {
  /**
   * Transform to custom value
   * @param value value to transform
   */
  to(value) {
    if (value == undefined) {
      return Hash.make(Date.now().toString());
    }
    return Hash.make(value);
  }

  from(value) {
    return value;
  }
}
