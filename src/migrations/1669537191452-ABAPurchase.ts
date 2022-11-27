import { MigrationInterface, QueryRunner } from 'typeorm';

export class ABAPurchase1669537191452 implements MigrationInterface {
  name = 'ABAPurchase1669537191452';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."aba-transfers_status_enum" AS ENUM('PENDING', 'DONE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "aba-transfers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "price" double precision NOT NULL, "transaction" text, "status" "public"."aba-transfers_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "UQ_53e5466a69e3d35ccf40a3831a8" UNIQUE ("transaction"), CONSTRAINT "PK_37fac769d502b0977d880b00336" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "UQ_8033bca1c7f0e3b44dd69c54983" UNIQUE ("transaction")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchases" DROP CONSTRAINT "UQ_8033bca1c7f0e3b44dd69c54983"`,
    );
    await queryRunner.query(`DROP TABLE "aba-transfers"`);
    await queryRunner.query(`DROP TYPE "public"."aba-transfers_status_enum"`);
  }
}
