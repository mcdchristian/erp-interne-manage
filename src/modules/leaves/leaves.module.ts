import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeavesController } from './presentation/controllers/leaves.controller';
import { LeavesService } from './application/services/leaves.service';
import { LeaveTypeOrmEntity } from './infrastructure/entities/leave.typeorm-entity';
import { LeaveRepository } from './infrastructure/repositories/leave.repository';
import { ILeaveRepository } from './domain/repositories/leave.repository.interface';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveTypeOrmEntity]),
    EmployeesModule, // Need EmployeesModule for IEmployeeRepository
  ],
  controllers: [LeavesController],
  providers: [
    LeavesService,
    {
      provide: ILeaveRepository,
      useClass: LeaveRepository,
    },
  ],
  exports: [LeavesService, ILeaveRepository],
})
export class LeavesModule {}
