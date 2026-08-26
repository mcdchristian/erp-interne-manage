import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { LeaveTypeOrmEntity } from '../../../leaves/infrastructure/entities/leave.typeorm-entity';

@Entity('employees')
export class EmployeeTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  position: string;

  @Column()
  department: string;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate: Date;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
    default: 'EMPLOYEE',
  })
  role: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string;

  @OneToMany(
    () => LeaveTypeOrmEntity,
    (leave: LeaveTypeOrmEntity) => leave.employee,
  )
  leaves: LeaveTypeOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
