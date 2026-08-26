import { Test, TestingModule } from '@nestjs/testing';
import { LeavesService } from './leaves.service';
import { ILeaveRepository } from '../../domain/repositories/leave.repository.interface';
import { IEmployeeRepository } from '../../../employees/domain/repositories/employee.repository.interface';
import { Leave, LeaveStatus, LeaveType } from '../../domain/entities/leave.entity';
import { Employee, EmployeeRole } from '../../../employees/domain/entities/employee.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('LeavesService', () => {
  let service: LeavesService;
  let leaveRepository: jest.Mocked<ILeaveRepository>;
  let employeeRepository: jest.Mocked<IEmployeeRepository>;

  const mockEmployee = new Employee(
    'emp-123',
    'Jean',
    'Dupont',
    'jean.dupont@company.com',
    'Developer',
    'IT',
    new Date('2024-01-15'),
    EmployeeRole.EMPLOYEE,
    'hashedPassword',
    new Date(),
    new Date(),
  );

  const mockLeave = new Leave(
    'leave-123',
    'emp-123',
    new Date('2024-06-01'),
    new Date('2024-06-10'),
    LeaveType.PAID,
    LeaveStatus.PENDING,
    'Vacances',
    new Date(),
    new Date(),
  );

  beforeEach(async () => {
    const mockLeaveRepo = {
      save: jest.fn(),
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      findByEmployeeId: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    };

    const mockEmployeeRepo = {
      save: jest.fn(),
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeavesService,
        {
          provide: ILeaveRepository,
          useValue: mockLeaveRepo,
        },
        {
          provide: IEmployeeRepository,
          useValue: mockEmployeeRepo,
        },
      ],
    }).compile();

    service = module.get<LeavesService>(LeavesService);
    leaveRepository = module.get(ILeaveRepository);
    employeeRepository = module.get(IEmployeeRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a leave request successfully', async () => {
      employeeRepository.findById.mockResolvedValue(mockEmployee);
      leaveRepository.findByEmployeeId.mockResolvedValue([]);
      leaveRepository.save.mockResolvedValue(mockLeave);

      const result = await service.create({
        employeeId: 'emp-123',
        startDate: '2024-06-01',
        endDate: '2024-06-10',
        type: LeaveType.PAID,
        reason: 'Vacances',
      });

      expect(result).toEqual(mockLeave);
      expect(leaveRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if employee not found', async () => {
      employeeRepository.findById.mockResolvedValue(null);

      await expect(
        service.create({
          employeeId: 'invalid-id',
          startDate: '2024-06-01',
          endDate: '2024-06-10',
          type: LeaveType.PAID,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if startDate is after endDate', async () => {
      employeeRepository.findById.mockResolvedValue(mockEmployee);

      await expect(
        service.create({
          employeeId: 'emp-123',
          startDate: '2024-06-10',
          endDate: '2024-06-01',
          type: LeaveType.PAID,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if leave dates overlap', async () => {
      employeeRepository.findById.mockResolvedValue(mockEmployee);
      leaveRepository.findByEmployeeId.mockResolvedValue([mockLeave]);

      await expect(
        service.create({
          employeeId: 'emp-123',
          startDate: '2024-06-05',
          endDate: '2024-06-08',
          type: LeaveType.SICK,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated leave requests', async () => {
      leaveRepository.findAllPaginated.mockResolvedValue([[mockLeave], 1]);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual([mockLeave]);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a leave request by ID', async () => {
      leaveRepository.findById.mockResolvedValue(mockLeave);

      const result = await service.findOne('leave-123');
      expect(result).toEqual(mockLeave);
    });

    it('should throw NotFoundException if leave request not found', async () => {
      leaveRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmployee', () => {
    it('should return leave requests for a valid employee', async () => {
      employeeRepository.findById.mockResolvedValue(mockEmployee);
      leaveRepository.findByEmployeeId.mockResolvedValue([mockLeave]);

      const result = await service.findByEmployee('emp-123');
      expect(result).toEqual([mockLeave]);
    });

    it('should throw NotFoundException if employee not found', async () => {
      employeeRepository.findById.mockResolvedValue(null);

      await expect(service.findByEmployee('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update status of a leave request', async () => {
      const updatedLeave = new Leave(
        mockLeave.id,
        mockLeave.employeeId,
        mockLeave.startDate,
        mockLeave.endDate,
        mockLeave.type,
        LeaveStatus.APPROVED,
        mockLeave.reason,
        mockLeave.createdAt,
        mockLeave.updatedAt,
      );

      leaveRepository.findById.mockResolvedValue(mockLeave);
      leaveRepository.updateStatus.mockResolvedValue(updatedLeave);

      const result = await service.updateStatus('leave-123', { status: LeaveStatus.APPROVED });
      expect(result.status).toBe(LeaveStatus.APPROVED);
    });

    it('should throw NotFoundException if leave request not found', async () => {
      leaveRepository.findById.mockResolvedValue(null);

      await expect(
        service.updateStatus('invalid-id', { status: LeaveStatus.APPROVED }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a leave request', async () => {
      leaveRepository.delete.mockResolvedValue(true);

      await expect(service.remove('leave-123')).resolves.not.toThrow();
    });

    it('should throw NotFoundException if leave request to delete is not found', async () => {
      leaveRepository.delete.mockResolvedValue(false);

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
