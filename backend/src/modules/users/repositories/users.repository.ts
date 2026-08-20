import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseRepository } from '@core/repositories/base.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {
    super();
  }

  findAll(options?: any): Promise<User[]> {
    return this.repo.find(options);
  }

  findOne(where: FindOptionsWhere<User>, options?: any): Promise<User> {
    return this.repo.findOne({ where, ...options });
  }

  findOneById(id: number, options?: any): Promise<User> {
    return this.repo.findOne({ where: { id }, ...options });
  }

  create(data: Partial<User>): User {
    return this.repo.create(data);
  }

  update(id: number, data: Partial<User>): Promise<User> {
    return this.repo.save({ ...data, id });
  }

  async delete(id: number): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }

  save(data: Partial<User>): Promise<User> {
    return this.repo.save(this.repo.create(data));
  }
}
