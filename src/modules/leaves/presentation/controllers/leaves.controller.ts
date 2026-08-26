import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { LeavesService } from '../../application/services/leaves.service';
import { CreateLeaveDto } from '../../application/dto/create-leave.dto';
import { UpdateLeaveStatusDto } from '../../application/dto/update-leave-status.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { EmployeeRole } from '../../../employees/domain/entities/employee.entity';

@ApiTags('Leaves')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new leave request' })
  @ApiCreatedResponse({ description: 'The leave request has been successfully created.' })
  @ApiForbiddenResponse({ description: 'Authentification requise.' })
  create(
    @CurrentUser() user: any,
    @Body() createLeaveDto: CreateLeaveDto,
  ) {
    if (user.role !== EmployeeRole.ADMIN && user.role !== EmployeeRole.MANAGER) {
      createLeaveDto.employeeId = user.id;
    }
    return this.leavesService.create(createLeaveDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leave requests with pagination' })
  @ApiOkResponse({ description: 'Return paginated leave requests.' })
  @ApiForbiddenResponse({ description: 'Authentification requise.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.leavesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single leave request by ID' })
  @ApiParam({ name: 'id', description: 'ID unique de la demande de congé (UUID)' })
  @ApiOkResponse({ description: 'Return the leave request.' })
  @ApiNotFoundResponse({ description: 'Leave request not found.' })
  @ApiForbiddenResponse({ description: 'Accès refusé - Vous n\'avez pas la permission de voir ce congé.' })
  async findOne(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    const leave = await this.leavesService.findOne(id);
    if (
      user.role !== EmployeeRole.ADMIN &&
      user.role !== EmployeeRole.MANAGER &&
      leave.employeeId !== user.id
    ) {
      throw new ForbiddenException('You are not allowed to view this leave request');
    }
    return leave;
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get all leave requests for a specific employee' })
  @ApiParam({ name: 'employeeId', description: 'ID unique de l\'employé (UUID)' })
  @ApiOkResponse({ description: 'Return leave requests for the employee.' })
  @ApiNotFoundResponse({ description: 'Employee not found.' })
  @ApiForbiddenResponse({ description: 'Accès refusé - Vous ne pouvez voir que vos propres demandes de congés.' })
  findByEmployee(
    @CurrentUser() user: any,
    @Param('employeeId') employeeId: string,
  ) {
    if (
      user.role !== EmployeeRole.ADMIN &&
      user.role !== EmployeeRole.MANAGER &&
      employeeId !== user.id
    ) {
      throw new ForbiddenException('You are not allowed to view leaves for this employee');
    }
    return this.leavesService.findByEmployee(employeeId);
  }

  @Patch(':id/status')
  @Roles(EmployeeRole.ADMIN, EmployeeRole.MANAGER)
  @ApiOperation({ summary: 'Approve or reject a leave request' })
  @ApiParam({ name: 'id', description: 'ID unique de la demande de congé (UUID)' })
  @ApiOkResponse({ description: 'The leave status has been updated.' })
  @ApiNotFoundResponse({ description: 'Leave request not found.' })
  @ApiForbiddenResponse({ description: 'Accès refusé - Rôle ADMIN ou MANAGER requis.' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateLeaveStatusDto: UpdateLeaveStatusDto,
  ) {
    return this.leavesService.updateStatus(id, updateLeaveStatusDto);
  }

  @Delete(':id')
  @Roles(EmployeeRole.ADMIN)
  @ApiOperation({ summary: 'Delete a leave request' })
  @ApiParam({ name: 'id', description: 'ID unique de la demande de congé à supprimer (UUID)' })
  @ApiOkResponse({ description: 'The leave request has been deleted.' })
  @ApiNotFoundResponse({ description: 'Leave request not found.' })
  @ApiForbiddenResponse({ description: 'Accès refusé - Seul l\'administrateur peut supprimer une demande de congé.' })
  remove(@Param('id') id: string) {
    return this.leavesService.remove(id);
  }
}
