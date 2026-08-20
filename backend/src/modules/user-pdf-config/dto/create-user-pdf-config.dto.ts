import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserPdfConfigDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  reportTitle?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  selectedStandardFields: string[];

  @IsArray()
  @IsString({ each: true })
  selectedCustomFieldKeys: string[];
}
