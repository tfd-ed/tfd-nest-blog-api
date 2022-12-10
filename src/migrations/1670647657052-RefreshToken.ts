import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefreshToken1670647657052 implements MigrationInterface {
  name = 'RefreshToken1670647657052';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "refreshToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
  }
}
