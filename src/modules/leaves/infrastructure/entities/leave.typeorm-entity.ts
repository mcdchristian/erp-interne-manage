import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EmployeeTypeOrmEntity } from '../../../employees/infrastructure/entities/employee.typeorm-entity';
import { LeaveType, LeaveStatus } from '../../domain/entities/leave.entity';

@Entity('leaves')
export class LeaveTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @ManyToOne(() => EmployeeTypeOrmEntity, (employee) => employee.leaves)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeTypeOrmEntity;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ type: 'varchar', default: LeaveType.PAID })
  type: LeaveType;

  @Column({ type: 'varchar', default: LeaveStatus.PENDING })
  status: LeaveStatus;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
