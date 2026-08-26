import { Test, TestingModule } from '@nestjs/testing';
import { ReportingService } from './reporting.service';
import { IEmployeeRepository } from '../../../employees/domain/repositories/employee.repository.interface';
import { ILeaveRepository } from '../../../leaves/domain/repositories/leave.repository.interface';
import { Employee, EmployeeRole } from '../../../employees/domain/entities/employee.entity';
import { Leave, LeaveStatus, LeaveType } from '../../../leaves/domain/entities/leave.entity';

describe('ReportingService', () => {
  let service: ReportingService;
  let employeeRepository: jest.Mocked<IEmployeeRepository>;
  let leaveRepository: jest.Mocked<ILeaveRepository>;

  const mockEmployees = [
    new Employee('Jean', 'Dupont', 'jean@co.com', 'Dev', 'IT', new Date(), EmployeeRole.EMPLOYEE, 'hash', 'e1'),
    new Employee('Marie', 'Martin', 'marie@co.com', 'PM', 'IT', new Date(), EmployeeRole.MANAGER, 'hash', 'e2'),
    new Employee('Paul', 'Blanc', 'paul@co.com', 'Sales', 'Commercial', new Date(), EmployeeRole.EMPLOYEE, 'hash', 'e3'),
  ];

  const mockLeaves = [
    new Leave('l1', 'e1', new Date(), new Date(), LeaveType.PAID, LeaveStatus.PENDING, null, new Date(), new Date()),
    new Leave('l2', 'e1', new Date(), new Date(), LeaveType.SICK, LeaveStatus.APPROVED, null, new Date(), new Date()),
    new Leave('l3', 'e2', new Date(), new Date(), LeaveType.PAID, LeaveStatus.REJECTED, null, new Date(), new Date()),
    new Leave('l4', 'e3', new Date(), new Date(), LeaveType.UNPAID, LeaveStatus.PENDING, null, new Date(), new Date()),
  ];

  beforeEach(async () => {
    const mockEmployeeRepo = {
      findAll: jest.fn(),
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockLeaveRepo = {
      findAll: jest.fn(),
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      findByEmployeeId: jest.fn(),
      save: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportingService,
        { provide: IEmployeeRepository, useValue: mockEmployeeRepo },
        { provide: ILeaveRepository, useValue: mockLeaveRepo },
      ],
    }).compile();

    service = module.get<ReportingService>(ReportingService);
    employeeRepository = module.get(IEmployeeRepository);
    leaveRepository = module.get(ILeaveRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEmployeeDepartmentStats', () => {
    it('should return employee count grouped by department', async () => {
      employeeRepository.findAll.mockResolvedValue(mockEmployees);

      const result = await service.getEmployeeDepartmentStats();

      expect(result).toEqual([
        { department: 'IT', count: 2 },
        { department: 'Commercial', count: 1 },
      ]);
    });

    it('should return empty array when no employees exist', async () => {
      employeeRepository.findAll.mockResolvedValue([]);

      const result = await service.getEmployeeDepartmentStats();
      expect(result).toEqual([]);
    });
  });

  describe('getLeaveStatusStats', () => {
    it('should return leave count grouped by status', async () => {
      leaveRepository.findAll.mockResolvedValue(mockLeaves);

      const result = await service.getLeaveStatusStats();

      expect(result).toEqual(
        expect.arrayContaining([
          { status: 'PENDING', count: 2 },
          { status: 'APPROVED', count: 1 },
          { status: 'REJECTED', count: 1 },
        ]),
      );
    });

    it('should return empty array when no leaves exist', async () => {
      leaveRepository.findAll.mockResolvedValue([]);

      const result = await service.getLeaveStatusStats();
      expect(result).toEqual([]);
    });
  });

  describe('getOverallSummary', () => {
    it('should return aggregated summary of employees and leaves', async () => {
      employeeRepository.findAll.mockResolvedValue(mockEmployees);
      leaveRepository.findAll.mockResolvedValue(mockLeaves);

      const result = await service.getOverallSummary();

      expect(result).toEqual({
        totalEmployees: 3,
        totalLeaves: 4,
        leavesByStatus: {
          PENDING: 2,
          APPROVED: 1,
          REJECTED: 1,
        },
      });
    });

    it('should handle zero data gracefully', async () => {
      employeeRepository.findAll.mockResolvedValue([]);
      leaveRepository.findAll.mockResolvedValue([]);

      const result = await service.getOverallSummary();

      expect(result).toEqual({
        totalEmployees: 0,
        totalLeaves: 0,
        leavesByStatus: {
          PENDING: 0,
          APPROVED: 0,
          REJECTED: 0,
        },
      });
    });
  });
});
