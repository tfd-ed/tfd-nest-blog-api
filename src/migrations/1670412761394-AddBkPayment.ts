import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBkPayment1670412761394 implements MigrationInterface {
  name = 'AddBkPayment1670412761394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" ADD "bkPaymentLink" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP COLUMN "bkPaymentLink"`,
    );
  }
}
