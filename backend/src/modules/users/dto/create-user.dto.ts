import { IsEmail, IsEnum, IsString, Length, MinLength } from 'class-validator';
import { UserRole } from '@core/enums/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
