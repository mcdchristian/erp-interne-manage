import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leave, LeaveStatus } from '../../domain/entities/leave.entity';
import { ILeaveRepository } from '../../domain/repositories/leave.repository.interface';
import { LeaveTypeOrmEntity } from '../entities/leave.typeorm-entity';

@Injectable()
export class LeaveRepository implements ILeaveRepository {
  constructor(
    @InjectRepository(LeaveTypeOrmEntity)
    private readonly repository: Repository<LeaveTypeOrmEntity>,
  ) {}

  private mapToDomain(entity: LeaveTypeOrmEntity): Leave {
    return new Leave(
      entity.id,
      entity.employeeId,
      entity.startDate,
      entity.endDate,
      entity.type,
      entity.status,
      entity.reason,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private mapToTypeOrmEntity(leave: Leave): LeaveTypeOrmEntity {
    const entity = new LeaveTypeOrmEntity();
    if (leave.id) entity.id = leave.id;
    entity.employeeId = leave.employeeId;
    entity.startDate = leave.startDate;
    entity.endDate = leave.endDate;
    entity.type = leave.type;
    entity.status = leave.status;
    entity.reason = leave.reason;
    if (leave.createdAt) entity.createdAt = leave.createdAt;
    if (leave.updatedAt) entity.updatedAt = leave.updatedAt;
    return entity;
  }

  async findAll(): Promise<Leave[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.mapToDomain(entity));
  }

  async findById(id: string): Promise<Leave | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByEmployeeId(employeeId: string): Promise<Leave[]> {
    const entities = await this.repository.find({ where: { employeeId } });
    return entities.map((entity) => this.mapToDomain(entity));
  }

  async save(leave: Leave): Promise<Leave> {
    const typeormEntity = this.mapToTypeOrmEntity(leave);
    const savedEntity = await this.repository.save(typeormEntity);
    return this.mapToDomain(savedEntity);
  }

  async updateStatus(id: string, status: LeaveStatus): Promise<Leave | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
