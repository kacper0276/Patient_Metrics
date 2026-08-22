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
    let skipped = 0;
    const allColumns = new Map<string, string>();
    const sheetData = selectedSheets.map((sheetName) => {
      const rows = XLSX.utils.sheet_to_json<unknown[]>(
        workbook.Sheets[sheetName],
        { header: 1, defval: null, raw: true },
      );
      const customData: Record<string, string | number | boolean | null> = {};
      const usedKeys = new Set<string>();

      for (const row of rows) {
        const values = row.map((value) => this.normalizeValue(value));
        for (let valueIndex = 0; valueIndex < values.length - 1; valueIndex++) {
          const label = values[valueIndex];
          const result = values[valueIndex + 1];
          if (typeof label !== 'string' || result === null) continue;
          if (this.isResultsHeader(label, result)) continue;
          if (this.isIgnoredField(label)) continue;

          const baseKey = this.normalizeColumn(label);
          if (!baseKey) continue;
          const key = this.uniqueKey(baseKey, usedKeys);
          usedKeys.add(key);
          allColumns.set(key, label);
          customData[key] = result;
        }
      }

      return { sheetName, customData };
    });

    const existingFields = await this.customFieldsService.findAll(userId);
    for (const field of existingFields) {
      if (this.isIgnoredField(field.name)) {
        await this.customFieldsService.delete(field.id, userId);
      }
    }
    const existingKeys = new Set(
      existingFields
        .filter((field) => !this.isIgnoredField(field.name))
        .map((field) => field.key),
    );
    for (const [key, name] of allColumns) {
      if (existingKeys.has(key)) continue;
      await this.customFieldsService.create(
        { name, key, type: FieldType.TEXT },
        userId,
      );
      existingKeys.add(key);
    }

    for (const { sheetName, customData } of sheetData) {
      if (!Object.keys(customData).length) {
        skipped++;
        continue;
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

    return { imported, skipped, sheets: selectedSheets };
  }

  private isResultsHeader(
    label: string | number | boolean | null,
    result: string | number | boolean | null,
  ): boolean {
    return (
      typeof label === 'string' &&
      typeof result === 'string' &&
      ['pytanie', 'wartosc', 'value'].includes(this.normalizeColumn(label)) &&
      ['wynik', 'result', 'odpowiedz'].includes(this.normalizeColumn(result))
    );
  }

  private uniqueKey(baseKey: string, usedKeys: Set<string>): string {
    if (!usedKeys.has(baseKey)) return baseKey;

    let suffix = 2;
    while (usedKeys.has(`${baseKey}${suffix}`)) suffix++;
    return `${baseKey}${suffix}`;
  }

  private isIgnoredField(label: string): boolean {
    const normalized = this.normalizeColumn(label);
    return (
      /^empty\d*$/.test(normalized) ||
      normalized.startsWith('skala') ||
      normalized === 'pytanie' ||
      normalized === 'czestosc' ||
      normalized === 'wynikibadan' ||
      normalized === 'produktyzywnosciowe' ||
      normalized === 'ankietawlasna' ||
      normalized === 'socjologicznedanepacjenta'
    );
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
