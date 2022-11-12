import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPromotionalColToCourse1668258982765
  implements MigrationInterface
{
  name = 'addPromotionalColToCourse1668258982765';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "promotionalVimeoLink" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP COLUMN "promotionalVimeoLink"`,
    );
  }
}
