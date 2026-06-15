import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../domain/entities/employee.entity';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { EmployeeTypeOrmEntity } from '../entities/employee.typeorm-entity';

@Injectable()
export class EmployeeRepository implements IEmployeeRepository {
  constructor(
    @InjectRepository(EmployeeTypeOrmEntity)
    private readonly repository: Repository<EmployeeTypeOrmEntity>,
  ) {}

  private mapToDomain(entity: EmployeeTypeOrmEntity): Employee {
    return new Employee(
      entity.id,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.position,
      entity.department,
      entity.hireDate,
      entity.role as any,
      entity.passwordHash,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private mapToTypeOrmEntity(employee: Employee): EmployeeTypeOrmEntity {
    const entity = new EmployeeTypeOrmEntity();
    if (employee.id) entity.id = employee.id;
    entity.firstName = employee.firstName;
    entity.lastName = employee.lastName;
    entity.email = employee.email;
    entity.position = employee.position;
    entity.department = employee.department;
    entity.hireDate = employee.hireDate;
    if (employee.role) entity.role = employee.role;
    if (employee.passwordHash) entity.passwordHash = employee.passwordHash;
    if (employee.createdAt) entity.createdAt = employee.createdAt;
    if (employee.updatedAt) entity.updatedAt = employee.updatedAt;
    return entity;
  }

  async findAll(): Promise<Employee[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.mapToDomain(entity));
  }

  async findAllPaginated(
    limit: number,
    offset: number,
  ): Promise<[Employee[], number]> {
    const [entities, count] = await this.repository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return [entities.map((entity) => this.mapToDomain(entity)), count];
  }

  async findById(id: string): Promise<Employee | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.mapToDomain(entity) : null;
  }

  async save(employee: Employee): Promise<Employee> {
    const typeormEntity = this.mapToTypeOrmEntity(employee);
    const savedEntity = await this.repository.save(typeormEntity);
    return this.mapToDomain(savedEntity);
  }

  async update(
    id: string,
    employee: Partial<Employee>,
  ): Promise<Employee | null> {
    await this.repository.update(id, employee);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
