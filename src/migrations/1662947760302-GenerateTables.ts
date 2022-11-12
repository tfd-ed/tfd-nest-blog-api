import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTables1662947760302 implements MigrationInterface {
  name = 'GenerateTables1662947760302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "common_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, CONSTRAINT "PK_7fec8b23c7862968df32e9abeff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "name" character varying NOT NULL, "path" text NOT NULL, "mimeType" text NOT NULL, "size" double precision NOT NULL, "key" text, "url" text, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chapters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "name" character varying(255) NOT NULL, "chapterNumber" integer NOT NULL, "description" text, "url" character varying, "vimeoId" character varying, "duration" integer NOT NULL, "courseId" uuid, CONSTRAINT "PK_a2bbdbb4bdc786fe0cb0fcfc4a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('BANNED', 'UNCONFIRMED', 'CONFIRMED', 'ACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "username" character varying(255) NOT NULL, "firstname" character varying(255) NOT NULL, "lastname" character varying(255) NOT NULL, "email" text NOT NULL, "dateOfBirth" date, "status" "public"."users_status_enum" NOT NULL DEFAULT 'UNCONFIRMED', "roles" text NOT NULL DEFAULT 'DEFAULT', "password" character varying(255) NOT NULL, "profileId" uuid, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "user-tb-index" ON "users" ("profileId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."purchases_status_enum" AS ENUM('VERIFIED', 'SUBMITTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "purchases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "status" "public"."purchases_status_enum" NOT NULL DEFAULT 'SUBMITTED', "price" double precision NOT NULL, "transaction" text, "byUserId" uuid, "courseId" uuid, "proofOfPaymentId" uuid, CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_15bed7927e86eba9e4e310fcf3" ON "purchases" ("byUserId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9e00826bda60cd275c0e6a36ff" ON "purchases" ("courseId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "name" character varying(255) NOT NULL, "description" text, "thumbnailId" uuid, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "category-tb-index" ON "categories" ("thumbnailId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "instructors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "biography" text, "name" text NOT NULL, "dateOfBirth" date, "profileId" uuid, CONSTRAINT "PK_95e3da69ca76176ea4ab8435098" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."courses_status_enum" AS ENUM('PUBLISHED', 'DRAFTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "title" character varying(255) NOT NULL, "shortDescription" text, "description" text, "price" double precision NOT NULL, "paymentLink" text NOT NULL, "duration" integer, "status" "public"."courses_status_enum" NOT NULL DEFAULT 'DRAFTED', "instructorId" uuid, "thumbnailId" uuid, "categoryId" uuid, CONSTRAINT "UQ_a01a7f0e38c6f16024d16058ab5" UNIQUE ("title"), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "course-instructor-index" ON "courses" ("instructorId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "course-tb-index" ON "courses" ("thumbnailId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "forgot-password-tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "email" text NOT NULL, "token" text NOT NULL, "done" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_49a02edd0fdf7cdf13bbd0ac996" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "reset-token-index" ON "forgot-password-tokens" ("token") `,
    );
    await queryRunner.query(
      `ALTER TABLE "chapters" ADD CONSTRAINT "FK_becd2c25ed5b601e7a4466271c8" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87" FOREIGN KEY ("profileId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_15bed7927e86eba9e4e310fcf34" FOREIGN KEY ("byUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_9e00826bda60cd275c0e6a36ff8" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" ADD CONSTRAINT "FK_85c5ee99158943b7d1d10002ff4" FOREIGN KEY ("proofOfPaymentId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_fd8814a2fd8c7aa766f0a0edb54" FOREIGN KEY ("thumbnailId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instructors" ADD CONSTRAINT "FK_89d88ea818aa5e3c57cac3776ce" FOREIGN KEY ("profileId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_e6714597bea722629fa7d32124a" FOREIGN KEY ("instructorId") REFERENCES "instructors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_28dcb6eab95ecd3598c4220cfef" FOREIGN KEY ("thumbnailId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_c730473dfb837b3e62057cd9447" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_c730473dfb837b3e62057cd9447"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_28dcb6eab95ecd3598c4220cfef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_e6714597bea722629fa7d32124a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instructors" DROP CONSTRAINT "FK_89d88ea818aa5e3c57cac3776ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_fd8814a2fd8c7aa766f0a0edb54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" DROP CONSTRAINT "FK_85c5ee99158943b7d1d10002ff4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" DROP CONSTRAINT "FK_9e00826bda60cd275c0e6a36ff8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchases" DROP CONSTRAINT "FK_15bed7927e86eba9e4e310fcf34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chapters" DROP CONSTRAINT "FK_becd2c25ed5b601e7a4466271c8"`,
    );
    await queryRunner.query(`DROP INDEX "public"."reset-token-index"`);
    await queryRunner.query(`DROP TABLE "forgot-password-tokens"`);
    await queryRunner.query(`DROP INDEX "public"."course-tb-index"`);
    await queryRunner.query(`DROP INDEX "public"."course-instructor-index"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TYPE "public"."courses_status_enum"`);
    await queryRunner.query(`DROP TABLE "instructors"`);
    await queryRunner.query(`DROP INDEX "public"."category-tb-index"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9e00826bda60cd275c0e6a36ff"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_15bed7927e86eba9e4e310fcf3"`,
    );
    await queryRunner.query(`DROP TABLE "purchases"`);
    await queryRunner.query(`DROP TYPE "public"."purchases_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."user-tb-index"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TABLE "chapters"`);
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TABLE "common_entity"`);
  }
}
