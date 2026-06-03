import { Module } from '@nestjs/common';
import { ReportingController } from './presentation/controllers/reporting.controller';
import { ReportingService } from './application/services/reporting.service';
import { EmployeesModule } from '../employees/employees.module';
import { LeavesModule } from '../leaves/leaves.module';

@Module({
  imports: [EmployeesModule, LeavesModule],
  controllers: [ReportingController],
  providers: [ReportingService],
})
export class ReportingModule {}
