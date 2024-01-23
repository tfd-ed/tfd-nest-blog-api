import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseTitleURL1668673099396 implements MigrationInterface {
  name = 'CourseTitleURL1668673099396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "titleURL" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "UQ_4612fc1df44efb917c75af6eabe" UNIQUE ("titleURL")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "UQ_4612fc1df44efb917c75af6eabe"`,
    );
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "titleURL"`);
  }
}
