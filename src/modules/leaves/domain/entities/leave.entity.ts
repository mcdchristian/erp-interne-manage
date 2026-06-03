export enum LeaveType {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  SICK = 'SICK',
  MATERNITY = 'MATERNITY',
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class Leave {
  constructor(
    public readonly id: string,
    public readonly employeeId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly type: LeaveType,
    public readonly status: LeaveStatus,
    public readonly reason: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
