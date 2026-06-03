import { Injectable, Inject } from '@nestjs/common';
import { IEmployeeRepository } from '../../../employees/domain/repositories/employee.repository.interface';
import { ILeaveRepository } from '../../../leaves/domain/repositories/leave.repository.interface';

@Injectable()
export class ReportingService {
  constructor(
    @Inject(IEmployeeRepository)
    private readonly employeeRepository: IEmployeeRepository,
    @Inject(ILeaveRepository)
    private readonly leaveRepository: ILeaveRepository,
  ) {}

  async getEmployeeDepartmentStats() {
    const employees = await this.employeeRepository.findAll();
    
    const stats: Record<string, number> = {};
    for (const employee of employees) {
      if (!stats[employee.department]) {
        stats[employee.department] = 0;
      }
      stats[employee.department]++;
    }

    return Object.entries(stats).map(([department, count]) => ({
      department,
      count,
    }));
  }

  async getLeaveStatusStats() {
    const leaves = await this.leaveRepository.findAll();
    
    const stats: Record<string, number> = {};
    for (const leave of leaves) {
      if (!stats[leave.status]) {
        stats[leave.status] = 0;
      }
      stats[leave.status]++;
    }

    return Object.entries(stats).map(([status, count]) => ({
      status,
      count,
    }));
  }

  async getOverallSummary() {
    const employees = await this.employeeRepository.findAll();
    const leaves = await this.leaveRepository.findAll();

    const pendingLeaves = leaves.filter((l) => l.status === 'PENDING').length;
    const approvedLeaves = leaves.filter((l) => l.status === 'APPROVED').length;
    const rejectedLeaves = leaves.filter((l) => l.status === 'REJECTED').length;

    return {
      totalEmployees: employees.length,
      totalLeaves: leaves.length,
      leavesByStatus: {
        PENDING: pendingLeaves,
        APPROVED: approvedLeaves,
        REJECTED: rejectedLeaves,
      },
    };
  }
}
