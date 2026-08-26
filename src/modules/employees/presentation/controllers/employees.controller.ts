import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { EmployeesService } from '../../application/services/employees.service';
import { CreateEmployeeDto } from '../../application/dto/create-employee.dto';
import { UpdateEmployeeDto } from '../../application/dto/update-employee.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { EmployeeRole } from '../../domain/entities/employee.entity';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles(EmployeeRole.ADMIN)
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiCreatedResponse({ description: 'The employee has been successfully created.' })
  @ApiForbiddenResponse({ description: 'Accès refusé - Seul l\'administrateur peut créer un employé.' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get('me')
  @Roles(EmployeeRole.ADMIN, EmployeeRole.MANAGER, EmployeeRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'Return the current employee profile.' })
  @ApiForbiddenResponse({ description: 'Authentification requise.' })
  getProfile(@CurrentUser() user: any) {
    return this.employeesService.findOne(user.id);
  }

  @Get()
  @Roles(EmployeeRole.ADMIN, EmployeeRole.MANAGER)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get all employees with pagination' })
  @ApiOkResponse({ description: 'Return paginated employees.' })
  @ApiForbiddenResponse({ description: 'Accès refusé - Rôle insuffisant.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.employeesService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(EmployeeRole.ADMIN, EmployeeRole.MANAGER)
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get a single employee by ID' })
  @ApiParam({ name: 'id', description: 'ID unique de l\'employé (UUID)' })
  @ApiOkResponse({ description: 'Return the employee.' })
  @ApiNotFoundResponse({ description: 'Employee not found.' })
  @ApiForbiddenResponse({ description: 'Accès refusé - Rôle insuffisant.' })
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch('me')
  @Roles(EmployeeRole.ADMIN, EmployeeRole.MANAGER, EmployeeRole.EMPLOYEE)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ description: 'The profile has been successfully updated.' })
  @ApiForbiddenResponse({ description: 'Authentification requise.' })
  updateMe(
    @CurrentUser() user: any,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    if (user.role !== EmployeeRole.ADMIN) {
      delete updateEmployeeDto.role;
      delete updateEmployeeDto.hireDate;
      delete updateEmployeeDto.position;
      delete updateEmployeeDto.department;
    }
    return this.employeesService.update(user.id, updateEmployeeDto);
  }

  @Patch(':id')
  @Roles(EmployeeRole.ADMIN)
  @ApiOperation({ summary: 'Update an employee' })
  @ApiParam({ name: 'id', description: 'ID unique de l\'employé à modifier (UUID)' })
  @ApiOkResponse({ description: 'The employee has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'Employee not found.' })
  @ApiForbiddenResponse({ description: 'Accès refusé - Seul l\'administrateur peut modifier un employé.' })
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles(EmployeeRole.ADMIN)
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiParam({ name: 'id', description: 'ID unique de l\'employé à supprimer (UUID)' })
  @ApiOkResponse({ description: 'The employee has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Employee not found.' })
  @ApiForbiddenResponse({ description: 'Accès refusé - Seul l\'administrateur peut supprimer un employé.' })
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
