import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseRepository } from '@core/repositories/base.repository';
import { CustomField } from '../entities/custom-field.entity';

@Injectable()
export class CustomFieldsRepository extends BaseRepository<CustomField> {
  constructor(
    @InjectRepository(CustomField)
    private readonly repo: Repository<CustomField>,
  ) {
    super();
  }

  findAll(options?: any): Promise<CustomField[]> {
    return this.repo.find(options);
  }

  findOne(
    where: FindOptionsWhere<CustomField>,
    options?: any,
  ): Promise<CustomField> {
    return this.repo.findOne({ where, ...options });
  }

  findOneById(id: number, options?: any): Promise<CustomField> {
    return this.repo.findOne({ where: { id }, ...options });
  }

  create(data: Partial<CustomField>): CustomField {
    return this.repo.create(data);
  }

  update(id: number, data: Partial<CustomField>): Promise<CustomField> {
    return this.repo.save({ ...data, id });
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }

  save(data: Partial<CustomField>): Promise<CustomField> {
    return this.repo.save(this.repo.create(data));
  }
}
