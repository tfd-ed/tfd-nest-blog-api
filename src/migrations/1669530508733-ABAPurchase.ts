import { MigrationInterface, QueryRunner } from 'typeorm';

export class ABAPurchase1669530508733 implements MigrationInterface {
  name = 'ABAPurchase1669530508733';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "aba-transfers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "price" double precision NOT NULL, "transaction" text, CONSTRAINT "PK_37fac769d502b0977d880b00336" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "aba-transfers"`);
  }
}
