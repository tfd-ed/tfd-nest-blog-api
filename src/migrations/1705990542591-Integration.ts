import { MigrationInterface, QueryRunner } from 'typeorm';

export class Integration1705990542591 implements MigrationInterface {
  name = 'Integration1705990542591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."integration_provider_enum" AS ENUM('GOOGLE', 'FACEBOOK', 'GITHUB')`,
    );
    await queryRunner.query(
      `CREATE TABLE "integration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "integrationId" text NOT NULL, "provider" "public"."integration_provider_enum" NOT NULL, "byUserId" uuid, CONSTRAINT "UQ_a08ea9d17554eac051c143b1c7e" UNIQUE ("integrationId"), CONSTRAINT "PK_f348d4694945d9dc4c7049a178a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3b86e44f6c7d1148a7f894d2f7" ON "integration" ("byUserId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_registrationtype_enum" AS ENUM('EMAIL', 'SSO')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "registrationType" "public"."users_registrationtype_enum" NOT NULL DEFAULT 'EMAIL'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "lastname" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "aba-transfers" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE "integration" ADD CONSTRAINT "FK_3b86e44f6c7d1148a7f894d2f78" FOREIGN KEY ("byUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integration" DROP CONSTRAINT "FK_3b86e44f6c7d1148a7f894d2f78"`,
    );
    await queryRunner.query(
      `ALTER TABLE "aba-transfers" ALTER COLUMN "status" SET DEFAULT 'PENDING'-transfers_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "lastname" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "registrationType"`,
    );
    await queryRunner.query(`DROP TYPE "public"."users_registrationtype_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3b86e44f6c7d1148a7f894d2f7"`,
    );
    await queryRunner.query(`DROP TABLE "integration"`);
    await queryRunner.query(`DROP TYPE "public"."integration_provider_enum"`);
  }
}
