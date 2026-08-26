import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { ReportingService } from '../../application/services/reporting.service';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { EmployeeRole } from '../../../employees/domain/entities/employee.entity';

@ApiTags('Reporting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(EmployeeRole.ADMIN, EmployeeRole.MANAGER)
@ApiForbiddenResponse({ description: 'Accès refusé - Rôle ADMIN ou MANAGER requis.' })
@UseInterceptors(CacheInterceptor)
@Controller('reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('employees/departments')
  @ApiOperation({ summary: 'Get employee headcount statistics by department' })
  @ApiOkResponse({ description: 'Return department-level employee statistics.' })
  getEmployeeStats() {
    return this.reportingService.getEmployeeDepartmentStats();
  }

  @Get('leaves/status')
  @ApiOperation({ summary: 'Get leave request statistics by status' })
  @ApiOkResponse({ description: 'Return leave status breakdown.' })
  getLeaveStats() {
    return this.reportingService.getLeaveStatusStats();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get overall ERP summary (employees + leaves)' })
  @ApiOkResponse({ description: 'Return aggregated summary of employees and leaves.' })
  getSummary() {
    return this.reportingService.getOverallSummary();
  }
}
