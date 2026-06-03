import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportingService } from '../../application/services/reporting.service';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@ApiTags('Reporting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MANAGER')
@Controller('reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('employees/departments')
  getEmployeeStats() {
    return this.reportingService.getEmployeeDepartmentStats();
  }

  @Get('leaves/status')
  getLeaveStats() {
    return this.reportingService.getLeaveStatusStats();
  }

  @Get('summary')
  getSummary() {
    return this.reportingService.getOverallSummary();
  }
}
