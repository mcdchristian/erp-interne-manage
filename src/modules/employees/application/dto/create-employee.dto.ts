import { IsString, IsEmail, IsNotEmpty, IsDateString, IsOptional, IsEnum, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeRole } from '../../domain/entities/employee.entity';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Prénom de l\'employé', example: 'Jean' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Nom de l\'employé', example: 'Dupont' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email professionnel', example: 'jean.dupont@entreprise.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Poste occupé', example: 'Développeur Backend' })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({ description: 'Département', example: 'IT' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ description: 'Date d\'embauche (ISO 8601)', example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  hireDate: string;

  @ApiProperty({ description: 'Mot de passe', example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, et un chiffre ou un caractère spécial',
  })
  password: string;

  @ApiPropertyOptional({ description: 'Rôle de l\'employé', enum: EmployeeRole, default: EmployeeRole.EMPLOYEE })
  @IsEnum(EmployeeRole)
  @IsOptional()
  role?: EmployeeRole;
}
