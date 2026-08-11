import {
  DATABASE_CONFIG_TOKEN,
  MIGRATION_CONFIG_TOKEN,
} from '@core/consts/injection-tokens';
import { DatabaseConfig } from '@core/json-config/interfaces/database-config.interface';
import { MigrationConfig } from '@core/json-config/interfaces/migration-config.interface';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ConfigService {
  constructor(
    @Inject(DATABASE_CONFIG_TOKEN)
    private readonly dbConfig: DatabaseConfig,
    @Inject(MIGRATION_CONFIG_TOKEN)
    private readonly migrationConfig: MigrationConfig,
  ) {}

  getDatabaseConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.dbConfig.host,
      port: this.dbConfig.port,
      username: this.dbConfig.username,
      password: this.dbConfig.password,
      database: this.dbConfig.database,
      synchronize: this.dbConfig.synchronize,
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    };
  }

  getMigrationsConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.migrationConfig.host,
      port: this.migrationConfig.port,
      username: this.migrationConfig.username,
      password: this.migrationConfig.password,
      database: this.migrationConfig.database,
      synchronize: this.migrationConfig.synchronize,
      migrations: ['src/core/database/migrations/*{.ts,.js}'],
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    };
  }
}
