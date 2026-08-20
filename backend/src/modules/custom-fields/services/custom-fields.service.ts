import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { CustomField } from '../entities/custom-field.entity';
import { CustomFieldsRepository } from '../repositories/custom-fields.repository';
import { CreateCustomFieldDto } from '../dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from '../dto/update-custom-field.dto';

@Injectable()
export class CustomFieldsService {
  constructor(private readonly repository: CustomFieldsRepository) {}

  findAll(userId: number): Promise<CustomField[]> {
    return this.repository.findAll({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<CustomField> {
    const field = await this.repository.findOne({ id, user: { id: userId } });
    if (!field) throw new NotFoundException('Custom field not found');
    return field;
  }

  create(dto: CreateCustomFieldDto, userId: number): Promise<CustomField> {
    return this.repository.save({ ...dto, user: { id: userId } as User });
  }

  async update(
    id: number,
    dto: UpdateCustomFieldDto,
    userId: number,
  ): Promise<CustomField> {
    await this.findOne(id, userId);
    return this.repository.update(id, dto);
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId);
    return this.repository.delete(id);
  }
}
