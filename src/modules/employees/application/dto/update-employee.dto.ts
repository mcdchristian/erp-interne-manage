import { IsString, IsEmail, IsOptional, IsDateString, IsEnum, MinLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeRole } from '../../domain/entities/employee.entity';

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ description: 'Prénom de l\'employé' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Nom de l\'employé' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Email professionnel' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Poste occupé' })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ description: 'Département' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({ description: 'Date d\'embauche (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  hireDate?: string;

  @ApiPropertyOptional({ description: 'Nouveau mot de passe', example: 'NewPassword123!' })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, et un chiffre ou un caractère spécial',
  })
  password?: string;

  @ApiPropertyOptional({ description: 'Rôle de l\'employé', enum: EmployeeRole })
  @IsEnum(EmployeeRole)
  @IsOptional()
  role?: EmployeeRole;
}
