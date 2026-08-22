import { FieldType } from '@shared/types/field.type';

export interface CustomField {
  id: number;
  name: string;
  key: string;
  type: FieldType;
  userId: number;
}
