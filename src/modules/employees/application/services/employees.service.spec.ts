import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EmployeesService } from './employees.service';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { Employee, EmployeeRole } from '../../domain/entities/employee.entity';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

jest.mock('bcrypt');

describe('EmployeesService', () => {
  let service: EmployeesService;
  let repository: jest.Mocked<IEmployeeRepository>;

  const mockEmployee = new Employee(
    'John',
    'Doe',
    'john.doe@example.com',
    'Developer',
    'IT',
    new Date(),
    EmployeeRole.EMPLOYEE,
    'hashedPassword',
    'uuid-123',
    new Date(),
    new Date(),
  );

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: IEmployeeRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
    repository = module.get(IEmployeeRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an employee', async () => {
      repository.findByEmail.mockResolvedValue(null);
      repository.save.mockResolvedValue(mockEmployee);

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt' as never);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword' as never);

      const dto: CreateEmployeeDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        position: 'Developer',
        department: 'IT',
        hireDate: new Date().toISOString(),
        role: EmployeeRole.EMPLOYEE,
        password: 'password123',
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockEmployee);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      repository.findByEmail.mockResolvedValue(mockEmployee);
      const dto = { email: 'john.doe@example.com' } as CreateEmployeeDto;

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated employees', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      repository.findAllPaginated.mockResolvedValue([[mockEmployee], 1]);

      const result = await service.findAll(paginationDto);
      expect(result).toEqual({
        data: [mockEmployee],
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return an employee', async () => {
      repository.findById.mockResolvedValue(mockEmployee);
      const result = await service.findOne('uuid-123');
      expect(result).toEqual(mockEmployee);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.findOne('uuid-123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an employee', async () => {
      repository.findById.mockResolvedValue(mockEmployee);
      repository.findByEmail.mockResolvedValue(null);
      repository.update.mockResolvedValue({ ...mockEmployee, firstName: 'Jane' });

      const result = await service.update('uuid-123', { firstName: 'Jane' });
      expect(result.firstName).toBe('Jane');
    });

    it('should throw ConflictException if new email is taken', async () => {
      repository.findById.mockResolvedValue(mockEmployee);
      repository.findByEmail.mockResolvedValue({ ...mockEmployee, id: 'other-id' });

      await expect(
        service.update('uuid-123', { email: 'taken@example.com' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove an employee', async () => {
      repository.delete.mockResolvedValue(true);
      await service.remove('uuid-123');
      expect(repository.delete).toHaveBeenCalledWith('uuid-123');
    });

    it('should throw NotFoundException if employee not found on remove', async () => {
      repository.delete.mockResolvedValue(false);
      await expect(service.remove('uuid-123')).rejects.toThrow(NotFoundException);
    });
  });
});
