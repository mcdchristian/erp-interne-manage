import { IsString, IsEmail, IsOptional, IsDateString, IsEnum } from 'class-validator';
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

  @ApiPropertyOptional({ description: 'Rôle de l\'employé', enum: EmployeeRole })
  @IsEnum(EmployeeRole)
  @IsOptional()
  role?: EmployeeRole;
}
