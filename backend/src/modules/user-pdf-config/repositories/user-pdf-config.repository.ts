import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseRepository } from '@core/repositories/base.repository';
import { UserPdfConfig } from '../entities/user-pdf-config.entity';

@Injectable()
export class UserPdfConfigRepository extends BaseRepository<UserPdfConfig> {
  constructor(
    @InjectRepository(UserPdfConfig)
    private readonly repo: Repository<UserPdfConfig>,
  ) {
    super();
  }

  findAll(options?: any): Promise<UserPdfConfig[]> {
    return this.repo.find(options);
  }

  findOne(
    where: FindOptionsWhere<UserPdfConfig>,
    options?: any,
  ): Promise<UserPdfConfig> {
    return this.repo.findOne({ where, ...options });
  }

  findOneById(id: number, options?: any): Promise<UserPdfConfig> {
    return this.repo.findOne({ where: { id }, ...options });
  }

  create(data: Partial<UserPdfConfig>): UserPdfConfig {
    return this.repo.create(data);
  }

  update(id: number, data: Partial<UserPdfConfig>): Promise<UserPdfConfig> {
    return this.repo.save({ ...data, id });
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }

  save(data: Partial<UserPdfConfig>): Promise<UserPdfConfig> {
    return this.repo.save(this.repo.create(data));
  }
}
