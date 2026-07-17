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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { EmployeesService } from '../../application/services/employees.service';
import { CreateEmployeeDto } from '../../application/dto/create-employee.dto';
import { UpdateEmployeeDto } from '../../application/dto/update-employee.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
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
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @Roles(EmployeeRole.ADMIN, EmployeeRole.MANAGER)
  @ApiOperation({ summary: 'Get all employees with pagination' })
  @ApiOkResponse({ description: 'Return paginated employees.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.employeesService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(EmployeeRole.ADMIN, EmployeeRole.MANAGER)
  @ApiOperation({ summary: 'Get a single employee by ID' })
  @ApiOkResponse({ description: 'Return the employee.' })
  @ApiNotFoundResponse({ description: 'Employee not found.' })
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @Roles(EmployeeRole.ADMIN)
  @ApiOperation({ summary: 'Update an employee' })
  @ApiOkResponse({ description: 'The employee has been successfully updated.' })
  @ApiNotFoundResponse({ description: 'Employee not found.' })
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles(EmployeeRole.ADMIN)
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiOkResponse({ description: 'The employee has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Employee not found.' })
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
