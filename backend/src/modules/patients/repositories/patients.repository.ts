import { BaseRepository } from '@core/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { Patient } from '../entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class PatientsRepository extends BaseRepository<Patient> {
  constructor(
    @InjectRepository(Patient)
    private readonly repo: Repository<Patient>,
  ) {
    super();
  }

  findAll(options?: any): Promise<Patient[]> {
    return this.repo.find(options);
  }

  findOne(where: FindOptionsWhere<Patient>, options?: any): Promise<Patient> {
    return this.repo.findOne({ where, ...options });
  }

  findOneById(id: number, options?: any): Promise<Patient> {
    return this.repo.findOne({ where: { id }, ...options });
  }

  create(data: Partial<Patient>): Patient {
    return this.repo.create(data);
  }

  update(id: number, data: Partial<Patient>): Promise<Patient> {
    return this.repo.save({ ...data, id });
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }

  save(data: Partial<Patient>): Promise<Patient> {
    return this.repo.save(this.repo.create(data));
  }
}
