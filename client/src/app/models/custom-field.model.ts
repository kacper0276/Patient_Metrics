export type FieldType = 'text' | 'number' | 'date' | 'boolean';

export interface CustomField {
  id: number;
  name: string;
  key: string;
  type: FieldType;
  userId: number;
}
