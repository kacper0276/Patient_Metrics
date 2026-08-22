import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { hashPassword } from '../../auth/password.util';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  findAll(): Promise<User[]> {
    return this.repository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repository.findOneById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const { password, ...user } = dto;
    return this.repository.save({
      ...user,
      passwordHash: await hashPassword(password),
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.findOne(id);
    return this.repository.delete(id);
  }
}
