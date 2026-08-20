import { IsObject, IsOptional, IsString, Length } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @Length(1, 255)
  firstName: string;

  @IsString()
  @Length(1, 255)
  lastName: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  pesel?: string;

  @IsOptional()
  @IsObject()
  customData?: Record<string, string | number | boolean | null>;
}
