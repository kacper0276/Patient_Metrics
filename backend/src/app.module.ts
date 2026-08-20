import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  DATABASE_CONFIG_TOKEN,
  MIGRATION_CONFIG_TOKEN,
} from '@core/consts/injection-tokens';
import { JsonConfigModule } from '@core/json-config/json-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@core/config/config.service';
import { ConfigModule as CustomConfigModule } from '@core/config/config.module';
import { MessageInterceptor } from '@core/interceptors/message.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticatedGuard } from '@core/guards/authenticated.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { CustomFieldsModule } from './modules/custom-fields/custom-fields.module';
import { UserPdfConfigModule } from './modules/user-pdf-config/user-pdf-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    CustomConfigModule.forRoot(),

    JsonConfigModule.register({
      fileName: 'database',
      providerToken: DATABASE_CONFIG_TOKEN,
      validationSchema: Joi.object({
        host: Joi.string().required(),
        port: Joi.number().port().required(),
        username: Joi.string().required(),
        password: Joi.string().allow('').required(),
        database: Joi.string().required(),
        synchronize: Joi.boolean().default(false),
      }),
    }),
    JsonConfigModule.register({
      fileName: 'migrations',
      providerToken: MIGRATION_CONFIG_TOKEN,
      validationSchema: Joi.object({
        host: Joi.string().required(),
        port: Joi.number().port().required(),
        username: Joi.string().required(),
        password: Joi.string().allow('').required(),
        database: Joi.string().required(),
        synchronize: Joi.boolean().default(false),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getDatabaseConfig(),
    }),

    UsersModule,
    PatientsModule,
    CustomFieldsModule,
    UserPdfConfigModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MessageInterceptor,
    },
  ],
})
export class AppModule {}
