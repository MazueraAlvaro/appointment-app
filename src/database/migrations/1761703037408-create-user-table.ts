import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1761703037408 implements MigrationInterface {
  name = 'CreateUserTable1761703037408';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "identification" character varying NOT NULL, "dateOfBirth" date NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(`INSERT INTO "user" (name, email, identification, "dateOfBirth", "isActive") VALUES
      ('Carlos Valdez', 'carlos.valdez@appointment-app.com', '123456', '1994-02-11', true),
      ('Maria Gomez', 'maria.gomez@appointment-app.com', '654321', '1993-10-24', true),
      ('Luis Fernandez', 'luis.fernandez@appointment-app.com', '112233', '1993-11-06', true)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
