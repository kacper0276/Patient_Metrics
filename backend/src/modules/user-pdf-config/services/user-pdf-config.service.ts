import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { UserPdfConfig } from '../entities/user-pdf-config.entity';
import { UserPdfConfigRepository } from '../repositories/user-pdf-config.repository';
import { CreateUserPdfConfigDto } from '../dto/create-user-pdf-config.dto';
import { UpdateUserPdfConfigDto } from '../dto/update-user-pdf-config.dto';

@Injectable()
export class UserPdfConfigService {
  constructor(private readonly repository: UserPdfConfigRepository) {}

  findAll(userId: number): Promise<UserPdfConfig[]> {
    return this.repository.findAll({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<UserPdfConfig> {
    const config = await this.repository.findOne({ id, user: { id: userId } });
    if (!config) throw new NotFoundException('PDF configuration not found');
    return config;
  }

  create(dto: CreateUserPdfConfigDto, userId: number): Promise<UserPdfConfig> {
    return this.repository.save({ ...dto, user: { id: userId } as User });
  }

  async update(
    id: number,
    dto: UpdateUserPdfConfigDto,
    userId: number,
  ): Promise<UserPdfConfig> {
    await this.findOne(id, userId);
    return this.repository.update(id, dto);
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId);
    return this.repository.delete(id);
  }
}
