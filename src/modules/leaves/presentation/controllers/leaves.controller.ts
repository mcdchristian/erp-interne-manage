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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LeavesService } from '../../application/services/leaves.service';
import { CreateLeaveDto } from '../../application/dto/create-leave.dto';
import { UpdateLeaveStatusDto } from '../../application/dto/update-leave-status.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

@ApiTags('Leaves')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post()
  create(@Body() createLeaveDto: CreateLeaveDto) {
    return this.leavesService.create(createLeaveDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.leavesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leavesService.findOne(id);
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.leavesService.findByEmployee(employeeId);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'MANAGER')
  updateStatus(
    @Param('id') id: string,
    @Body() updateLeaveStatusDto: UpdateLeaveStatusDto,
  ) {
    return this.leavesService.updateStatus(id, updateLeaveStatusDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.leavesService.remove(id);
  }
}
