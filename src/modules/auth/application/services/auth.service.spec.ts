import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { IEmployeeRepository } from '../../../employees/domain/repositories/employee.repository.interface';
import { Employee, EmployeeRole } from '../../../employees/domain/entities/employee.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let employeeRepository: jest.Mocked<IEmployeeRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockEmployee = new Employee(
    'Jean',
    'Dupont',
    'jean.dupont@company.com',
    'Developer',
    'IT',
    new Date('2024-01-15'),
    EmployeeRole.EMPLOYEE,
    'hashedPassword',
    'emp-123',
    new Date(),
    new Date(),
  );

  beforeEach(async () => {
    const mockEmployeeRepo = {
      save: jest.fn(),
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: IEmployeeRepository,
          useValue: mockEmployeeRepo,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    employeeRepository = module.get(IEmployeeRepository);
    jwtService = module.get<JwtService>(JwtService) as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should authenticate user and return token', async () => {
      employeeRepository.findByEmail.mockResolvedValue(mockEmployee);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login({
        email: 'jean.dupont@company.com',
        password: 'Password123!',
      });

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: 'emp-123',
          email: 'jean.dupont@company.com',
          role: EmployeeRole.EMPLOYEE,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockEmployee.email,
        sub: mockEmployee.id,
        role: mockEmployee.role,
      });
    });

    it('should throw UnauthorizedException if user email is not found', async () => {
      employeeRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'notfound@company.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      employeeRepository.findByEmail.mockResolvedValue(mockEmployee);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({
          email: 'jean.dupont@company.com',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
