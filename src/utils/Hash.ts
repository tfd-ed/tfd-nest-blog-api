import * as bcrypt from 'bcrypt';

export class Hash {
  static make(plainText) {
    const salt = bcrypt.genSaltSync(10, 'b');
    return bcrypt.hashSync(plainText, salt);
  }

  static compare(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
  }
}
