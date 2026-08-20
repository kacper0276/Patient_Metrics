import { Injectable, NotFoundException } from '@nestjs/common';
import { Patient } from '../entities/patient.entity';
import { PatientsRepository } from '../repositories/patients.repository';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class PatientsService {
  constructor(private readonly patientsRepository: PatientsRepository) {}

  findAll(userId: number): Promise<Patient[]> {
    return this.patientsRepository.findAll({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      id,
      user: { id: userId },
    });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  create(dto: CreatePatientDto, userId: number): Promise<Patient> {
    return this.patientsRepository.save({
      ...dto,
      user: { id: userId } as User,
    });
  }

  async update(
    id: number,
    dto: UpdatePatientDto,
    userId: number,
  ): Promise<Patient> {
    await this.findOne(id, userId);
    return this.patientsRepository.update(id, dto);
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId);
    return this.patientsRepository.delete(id);
  }
}
