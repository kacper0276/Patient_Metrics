import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class ConvertDemoPasswordsToBcrypt1786466331600 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = 'SuperAdmin123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    await queryRunner.query(
      `
      INSERT INTO \`users\` (\`email\`, \`name\`, \`role\`, \`passwordHash\`)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        \`name\` = VALUES(\`name\`),
        \`role\` = VALUES(\`role\`),
        \`passwordHash\` = VALUES(\`passwordHash\`);
    `,
      [
        'superadmin@patientmetrics.local',
        'Super Admin',
        'admin',
        hashedPassword,
      ],
    );
  }

  public async down(): Promise<void> {}
}
