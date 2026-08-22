import { Injectable, NotFoundException } from '@nestjs/common';
import { Patient } from '../entities/patient.entity';
import { PatientsRepository } from '../repositories/patients.repository';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { User } from '../../users/entities/user.entity';
import * as XLSX from 'xlsx';
import { CustomFieldsService } from '../../custom-fields/services/custom-fields.service';
import { FieldType } from '../../custom-fields/enums/field-type.enum';

export interface ExcelUpload {
  buffer: Buffer;
}

@Injectable()
export class PatientsService {
  constructor(
    private readonly patientsRepository: PatientsRepository,
    private readonly customFieldsService: CustomFieldsService,
  ) {}

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

  async importFromExcel(file: ExcelUpload, userId: number) {
    const workbook = XLSX.read(file.buffer, {
      type: 'buffer',
      cellDates: true,
    });
    const selectedSheets = workbook.SheetNames.filter((name) =>
      /^\d+06$/.test(name.trim()),
    );
    let imported = 0;
    const allColumns = new Map<string, string>();
    const sheetRows = selectedSheets.map((sheetName) => {
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        workbook.Sheets[sheetName],
        { defval: null },
      );
      for (const row of rows) {
        for (const column of Object.keys(row)) {
          const key = this.normalizeColumn(column);
          if (key) allColumns.set(key, column);
        }
      }
      return { sheetName, rows };
    });

    const existingFields = await this.customFieldsService.findAll(userId);
    const existingKeys = new Set(existingFields.map((field) => field.key));
    for (const [key, name] of allColumns) {
      if (existingKeys.has(key)) continue;
      await this.customFieldsService.create(
        { name, key, type: FieldType.TEXT },
        userId,
      );
      existingKeys.add(key);
    }

    for (const { sheetName, rows } of sheetRows) {
      for (const row of rows) {
        const columns = Object.keys(row);
        const customData: Record<string, string | number | boolean | null> = {};
        for (const column of columns) {
          const key = this.normalizeColumn(column);
          if (key) customData[key] = this.normalizeValue(row[column]);
        }

        await this.create(
          {
            firstName: sheetName,
            lastName: sheetName,
            customData,
          },
          userId,
        );
        imported++;
      }
    }

    return { imported, skipped: 0, sheets: selectedSheets };
  }

  private normalizeColumn(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  private normalizeValue(value: unknown): string | number | boolean | null {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'boolean' || typeof value === 'number') return value;
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (typeof value === 'string') return value.trim();
    return JSON.stringify(value);
  }
}
