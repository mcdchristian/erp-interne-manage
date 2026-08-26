import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Employee, EmployeeRole } from '../../domain/entities/employee.entity';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @Inject(IEmployeeRepository)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.employeeRepository.findByEmail(createEmployeeDto.email);
    if (existingEmployee) {
      throw new ConflictException('Employee with this email already exists');
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, salt);

    const newEmployee = new Employee(
      createEmployeeDto.firstName,
      createEmployeeDto.lastName,
      createEmployeeDto.email,
      createEmployeeDto.position,
      createEmployeeDto.department,
      new Date(createEmployeeDto.hireDate),
      (createEmployeeDto.role as EmployeeRole) || EmployeeRole.EMPLOYEE,
      hashedPassword,
    );

    return this.employeeRepository.save(newEmployee);
  }

  async findAll(paginationDto: PaginationDto): Promise<{ data: Employee[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const offset = (page - 1) * limit;

    const [data, total] = await this.employeeRepository.findAllPaginated(limit, offset);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.employeeRepository.findById(id);
    if (!existingEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    // Check if updating email to one that already exists
    if (updateEmployeeDto.email && updateEmployeeDto.email !== existingEmployee.email) {
      const emailTaken = await this.employeeRepository.findByEmail(updateEmployeeDto.email);
      if (emailTaken) {
        throw new ConflictException('Email already in use');
      }
    }

    // Build a typed patch object from the DTO, converting date strings to Date
    const { hireDate, password, ...rest } = updateEmployeeDto as Partial<UpdateEmployeeDto & { password?: string }>;
    
    let hashedPassword;
    if (password) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const patch: Partial<Employee> = {
      ...(rest as Partial<Employee>),
      ...(hireDate ? { hireDate: new Date(hireDate as unknown as string) } : {}),
      ...(password ? { passwordHash: hashedPassword } : {}),
    };

    const updatedEmployee = await this.employeeRepository.update(id, patch);
    if (!updatedEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return updatedEmployee;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.employeeRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  }
}
