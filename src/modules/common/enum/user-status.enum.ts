export enum UserStatus {
  BANNED = 'BANNED',
  UNCONFIRMED = 'UNCONFIRMED',
  /**
   * Confirmed status is set when the email is confirmed
   */
  CONFIRMED = 'CONFIRMED',
  /**
   * Active status is set when the profile setup is completed
   */
  ACTIVE = 'ACTIVE',
}
