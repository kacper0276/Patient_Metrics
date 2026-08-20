import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserPdfConfigDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  reportTitle?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedStandardFields?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedCustomFieldKeys?: string[];
}
