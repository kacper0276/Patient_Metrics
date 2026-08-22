import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientsController } from './controllers/patients.controller';
import { PatientsRepository } from './repositories/patients.repository';
import { PatientsService } from './services/patients.service';
import { CustomFieldsModule } from '../custom-fields/custom-fields.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), CustomFieldsModule],
  controllers: [PatientsController],
  providers: [PatientsRepository, PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
