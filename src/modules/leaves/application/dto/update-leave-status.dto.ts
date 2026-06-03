import { IsEnum, IsNotEmpty } from 'class-validator';
import { LeaveStatus } from '../../domain/entities/leave.entity';

export class UpdateLeaveStatusDto {
  @IsEnum(LeaveStatus)
  @IsNotEmpty()
  status: LeaveStatus;
}
