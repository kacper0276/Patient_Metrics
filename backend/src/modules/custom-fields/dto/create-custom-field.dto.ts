import { IsEnum, IsString, Length } from 'class-validator';
import { FieldType } from '../enums/field-type.enum';

export class CreateCustomFieldDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(1, 255)
  key: string;

  @IsEnum(FieldType)
  type: FieldType;
}
