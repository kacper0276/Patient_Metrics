import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePatientManagementTables1786466331597 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`role\` enum('admin', 'doctor', 'user') NOT NULL DEFAULT 'doctor',
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_users_email\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`custom_fields\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`key\` varchar(255) NOT NULL,
        \`type\` enum('text', 'number', 'date', 'boolean') NOT NULL DEFAULT 'text',
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`user_id\` int NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`patients\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`firstName\` varchar(255) NOT NULL,
        \`lastName\` varchar(255) NOT NULL,
        \`pesel\` varchar(255) NULL,
        \`customData\` json NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`user_id\` int NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`user_pdf_configs\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`reportTitle\` varchar(255) NOT NULL DEFAULT 'Domyślny Raport',
        \`selectedStandardFields\` json NOT NULL,
        \`selectedCustomFieldKeys\` json NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`user_id\` int NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      ALTER TABLE \`custom_fields\` 
      ADD CONSTRAINT \`FK_custom_fields_user_id\` 
      FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) 
      ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE \`patients\` 
      ADD CONSTRAINT \`FK_patients_user_id\` 
      FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) 
      ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
      ALTER TABLE \`user_pdf_configs\` 
      ADD CONSTRAINT \`FK_user_pdf_configs_user_id\` 
      FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) 
      ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_pdf_configs\` DROP FOREIGN KEY \`FK_user_pdf_configs_user_id\`;`,
    );
    await queryRunner.query(
      `ALTER TABLE \`patients\` DROP FOREIGN KEY \`FK_patients_user_id\`;`,
    );
    await queryRunner.query(
      `ALTER TABLE \`custom_fields\` DROP FOREIGN KEY \`FK_custom_fields_user_id\`;`,
    );

    await queryRunner.query(`DROP TABLE \`user_pdf_configs\`;`);
    await queryRunner.query(`DROP TABLE \`patients\`;`);
    await queryRunner.query(`DROP TABLE \`custom_fields\`;`);
    await queryRunner.query(`DROP TABLE \`users\`;`);
  }
}
