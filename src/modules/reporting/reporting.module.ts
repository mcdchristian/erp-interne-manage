import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ReportingController } from './presentation/controllers/reporting.controller';
import { ReportingService } from './application/services/reporting.service';
import { EmployeesModule } from '../employees/employees.module';
import { LeavesModule } from '../leaves/leaves.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300000, // 5 minutes
      max: 100, // maximum number of items in cache
    }),
    EmployeesModule,
    LeavesModule,
  ],
  controllers: [ReportingController],
  providers: [ReportingService],
})
export class ReportingModule {}
