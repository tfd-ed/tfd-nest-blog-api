import { MigrationInterface, QueryRunner } from 'typeorm';

export class FreeCourse1669251956995 implements MigrationInterface {
  name = 'FreeCourse1669251956995';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."courses_type_enum" AS ENUM('PAID', 'FREE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "type" "public"."courses_type_enum" NOT NULL DEFAULT 'FREE'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."courses_type_enum"`);
  }
}
