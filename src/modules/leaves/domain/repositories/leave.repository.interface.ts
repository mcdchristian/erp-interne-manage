import { Leave, LeaveStatus } from '../entities/leave.entity';

export const ILeaveRepository = Symbol('ILeaveRepository');

export interface ILeaveRepository {
  findAll(): Promise<Leave[]>;
  findById(id: string): Promise<Leave | null>;
  findByEmployeeId(employeeId: string): Promise<Leave[]>;
  save(leave: Leave): Promise<Leave>;
  updateStatus(id: string, status: LeaveStatus): Promise<Leave | null>;
  delete(id: string): Promise<boolean>;
}
