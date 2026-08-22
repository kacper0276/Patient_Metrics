import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPasswords1786466331599 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`users\`
      ADD COLUMN \`passwordHash\` varchar(255) NULL AFTER \`name\`;
    `);

    await queryRunner.query(`
      ALTER TABLE \`users\` MODIFY COLUMN \`passwordHash\` varchar(255) NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`passwordHash\`;`,
    );
  }
}
