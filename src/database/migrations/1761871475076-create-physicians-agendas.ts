import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePhysiciansAgendas1761871475076
  implements MigrationInterface
{
  name = 'CreatePhysiciansAgendas1761871475076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "medical_center" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying NOT NULL, "phoneNumber" character varying NOT NULL, CONSTRAINT "PK_6fad62674f823ba4d934fe5b3f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "agenda" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDate" date NOT NULL, "endDate" date NOT NULL, "isAvailable" boolean NOT NULL, "physicianId" uuid, "medicalCenterId" uuid, CONSTRAINT "PK_49397cfc20589bebaac8b43251d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "physician" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "licenseNumber" character varying NOT NULL, "specialty" character varying NOT NULL, CONSTRAINT "UQ_751fb29654eec976a47785c58b5" UNIQUE ("licenseNumber"), CONSTRAINT "PK_88f4ec9eb6d286c344cfeb1b58e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "appointment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "time" TIME NOT NULL, "isConfirmed" boolean NOT NULL DEFAULT false, "userId" uuid, "physicianId" uuid, "agendaId" uuid, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "agenda" ADD CONSTRAINT "FK_69a20b0c40c92cade3b139e6af6" FOREIGN KEY ("physicianId") REFERENCES "physician"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "agenda" ADD CONSTRAINT "FK_c0519bc947e706c7a25841ef016" FOREIGN KEY ("medicalCenterId") REFERENCES "medical_center"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_2a990a304a43ccc7415bf7e3a99" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_65c87f97f39d118d93cb8e5358f" FOREIGN KEY ("physicianId") REFERENCES "physician"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_b91ac2ab2bb26f4b99599060c38" FOREIGN KEY ("agendaId") REFERENCES "agenda"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await this.insertMedicalCenters(queryRunner);
    await this.insertPhysicians(queryRunner);
    await this.insertAgendas(queryRunner);
    await this.insertAppointments(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_b91ac2ab2bb26f4b99599060c38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_65c87f97f39d118d93cb8e5358f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_2a990a304a43ccc7415bf7e3a99"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agenda" DROP CONSTRAINT "FK_69a20b0c40c92cade3b139e6af6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "agenda" DROP CONSTRAINT "FK_c0519bc947e706c7a25841ef016"`,
    );
    await queryRunner.query(`DROP TABLE "appointment"`);
    await queryRunner.query(`DROP TABLE "physician"`);
    await queryRunner.query(`DROP TABLE "agenda"`);
    await queryRunner.query(`DROP TABLE "medical_center"`);
  }

  private insertMedicalCenters(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      INSERT INTO "medical_center" (name, address, "phoneNumber") VALUES
      ('Centro Médico Los Andes', 'Calle 123 #45-67, Cali', '555-1234'),
      ('Clínica Santa María', 'Avenida 89 #12-34, Cali', '555-5678'),
      ('Hospital General Central', 'Carrera 56 #78-90, Cali', '555-9012');
    `);
  }

  private insertPhysicians(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      INSERT INTO "physician" (name, "licenseNumber", specialty) VALUES
      ('Juan Pablo Carbonell Caicedo', 'LIC023520', 'MEDG845'),
      ('Juan Manuel Burgos', 'LIC8956412', 'MEDG845'),
      ('Natalia Calvache Hernandez', 'LIC454321', 'ODNT564'),
      ('Pedro Cifuentes', 'LIC123456', 'CARD123'),
      ('Carlos Ernesto Afanador', 'LIC234567', 'DERM456'),
      ('Maria Teresa Agudelo ', 'LIC345678', 'NEURO789'),
      ('Paula Benavides', 'LIC456789', 'PEDI101'),
      ('Fabio Bonilla Abadia', 'LIC567890', 'ORTH112');
    `);
  }

  private insertAgendas(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      INSERT INTO "agenda" ("startDate", "endDate", "isAvailable", "medicalCenterId", "physicianId") VALUES
      ('2025-11-01', '2025-11-30', true, (SELECT id from "medical_center" WHERE name = 'Centro Médico Los Andes'), (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520')),
      ('2025-11-01', '2025-11-30', true, (SELECT id from "medical_center" WHERE name = 'Centro Médico Los Andes'), (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412')),
      ('2025-11-01', '2025-11-30', true, (SELECT id from "medical_center" WHERE name = 'Centro Médico Los Andes'), (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321')),
      ('2025-11-01', '2025-11-30', true, (SELECT id from "medical_center" WHERE name = 'Centro Médico Los Andes'), (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456')),
      ('2025-11-01', '2025-11-30', true, (SELECT id from "medical_center" WHERE name = 'Centro Médico Los Andes'), (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567')),
      ('2025-11-01', '2025-11-30', true, (SELECT id from "medical_center" WHERE name = 'Centro Médico Los Andes'), (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678')),
      ('2025-11-01', '2025-11-30', true, (SELECT id from "medical_center" WHERE name = 'Centro Médico Los Andes'), (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789')),
      ('2025-11-01', '2025-11-30', true, (SELECT id from "medical_center" WHERE name = 'Centro Médico Los Andes'), (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890'));
    `);
  }

  private insertAppointments(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(`
      INSERT INTO "appointment" (date, time, "isConfirmed", "physicianId", "agendaId") VALUES
      ('2025-11-05', '09:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520') LIMIT 1)),
      ('2025-11-10', '10:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412') LIMIT 1)),
      ('2025-11-15', '14:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321') LIMIT 1)),
      ('2025-11-20', '11:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456') LIMIT 1)),
      ('2025-11-25', '15:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567') LIMIT 1)),
      ('2025-11-28', '13:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678') LIMIT 1)),
      ('2025-11-30', '09:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789') LIMIT 1)),
      ('2025-11-12', '16:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890') LIMIT 1)),
      ('2025-11-18', '10:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520') LIMIT 1)),
      ('2025-11-22', '14:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412') LIMIT 1)),
      ('2025-11-27', '12:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321') LIMIT 1)),
      ('2025-11-29', '15:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456') LIMIT 1)),
      ('2025-11-08', '11:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567') LIMIT 1)),
      ('2025-11-14', '09:15:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678') LIMIT 1)),
      ('2025-11-19', '13:45:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789') LIMIT 1)),
      ('2025-11-23', '10:15:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890') LIMIT 1)),
      ('2025-11-26', '14:45:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520') LIMIT 1)),
      ('2025-11-09', '12:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412') LIMIT 1)),
      ('2025-11-13', '15:15:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321') LIMIT 1)),
      ('2025-11-21', '09:45:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456') LIMIT 1)),
      ('2025-11-24', '13:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567') LIMIT 1)),
      ('2025-11-07', '10:45:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678') LIMIT 1)),
      ('2025-11-17', '12:15:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789') LIMIT 1)),
      ('2025-11-11', '16:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890') LIMIT 1)),
      ('2025-11-16', '11:15:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520') LIMIT 1)),
      ('2025-11-06', '14:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412') LIMIT 1)),
      ('2025-11-04', '09:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321') LIMIT 1)),
      ('2025-11-03', '13:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456') LIMIT 1)),
      ('2025-11-02', '15:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567') LIMIT 1)),
      ('2025-11-01', '11:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678') LIMIT 1)),
      ('2025-11-30', '10:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789') LIMIT 1)),
      ('2025-11-29', '14:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890') LIMIT 1)),
      ('2025-11-28', '09:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520') LIMIT 1)),
      ('2025-11-27', '13:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412') LIMIT 1)),
      ('2025-11-26', '15:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321') LIMIT 1)),
      ('2025-11-25', '11:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456') LIMIT 1)),
      ('2025-11-24', '09:15:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567') LIMIT 1)),
      ('2025-11-23', '14:45:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678') LIMIT 1)),
      ('2025-11-22', '12:15:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789') LIMIT 1)),
      ('2025-11-21', '16:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890') LIMIT 1)),
      ('2025-11-20', '10:15:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520') LIMIT 1)),
      ('2025-11-19', '13:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412') LIMIT 1)),
      ('2025-11-18', '09:45:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321') LIMIT 1)),
      ('2025-11-17', '15:15:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456') LIMIT 1)),
      ('2025-11-16', '11:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567') LIMIT 1)),
      ('2025-11-15', '14:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678') LIMIT 1)),
      ('2025-11-14', '10:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789') LIMIT 1)),
      ('2025-11-13', '13:15:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890') LIMIT 1)),
      ('2025-11-12', '09:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520') LIMIT 1)),
      ('2025-11-11', '12:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412') LIMIT 1)),
      ('2025-11-10', '15:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321') LIMIT 1)),
      ('2025-11-09', '11:15:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456') LIMIT 1)),
      ('2025-11-08', '14:45:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC234567') LIMIT 1)),
      ('2025-11-07', '10:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC345678') LIMIT 1)),
      ('2025-11-06', '13:15:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC456789') LIMIT 1)),
      ('2025-11-05', '09:45:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC567890') LIMIT 1)),
      ('2025-11-04', '12:30:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC023520') LIMIT 1)),
      ('2025-11-03', '15:15:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC8956412') LIMIT 1)),
      ('2025-11-02', '11:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC454321') LIMIT 1)),
      ('2025-11-01', '14:00:00', false, (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456'), (SELECT id FROM agenda WHERE "physicianId" = (SELECT id FROM physician WHERE "licenseNumber" = 'LIC123456') LIMIT 1));
    `);
  }
}
