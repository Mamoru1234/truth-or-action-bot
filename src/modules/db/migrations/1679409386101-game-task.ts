import { MigrationInterface, QueryRunner } from 'typeorm';

export class gameTask1679409386101 implements MigrationInterface {
  name = 'gameTask1679409386101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game_task_entity" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "text" character varying NOT NULL, CONSTRAINT "PK_3d2362c7ab7176158862308fb9a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "game_task_entity"`);
  }
}
