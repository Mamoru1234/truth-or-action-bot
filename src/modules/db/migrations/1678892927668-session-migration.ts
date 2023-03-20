import { MigrationInterface, QueryRunner } from 'typeorm';

export class sessionMigration1678892927668 implements MigrationInterface {
  name = 'sessionMigration1678892927668';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      // eslint-disable-next-line max-len
      'CREATE TABLE "chat_session_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "tgId" character varying NOT NULL, CONSTRAINT "PK_fae0fb01a1927d2351c04719901" PRIMARY KEY ("id"))',
    );
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_bae1967aa74d84474c21408d8a" ON "chat_session_entity" ("tgId") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."IDX_bae1967aa74d84474c21408d8a"');
    await queryRunner.query('DROP TABLE "chat_session_entity"');
  }
}
