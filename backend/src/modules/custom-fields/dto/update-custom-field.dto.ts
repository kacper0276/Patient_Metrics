import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { FieldType } from '../enums/field-type.enum';

export class UpdateCustomFieldDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  key?: string;

  @IsOptional()
  @IsEnum(FieldType)
  type?: FieldType;
}
