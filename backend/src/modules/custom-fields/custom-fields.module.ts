import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomField } from './entities/custom-field.entity';
import { CustomFieldsController } from './controllers/custom-fields.controller';
import { CustomFieldsRepository } from './repositories/custom-fields.repository';
import { CustomFieldsService } from './services/custom-fields.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomField])],
  controllers: [CustomFieldsController],
  providers: [CustomFieldsRepository, CustomFieldsService],
  exports: [CustomFieldsService],
})
export class CustomFieldsModule {}
