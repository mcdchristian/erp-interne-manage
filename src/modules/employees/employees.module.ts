import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './presentation/controllers/employees.controller';
import { EmployeesService } from './application/services/employees.service';
import { EmployeeTypeOrmEntity } from './infrastructure/entities/employee.typeorm-entity';
import { EmployeeRepository } from './infrastructure/repositories/employee.repository';
import { IEmployeeRepository } from './domain/repositories/employee.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeTypeOrmEntity])],
  controllers: [EmployeesController],
  providers: [
    EmployeesService,
    {
      provide: IEmployeeRepository,
      useClass: EmployeeRepository,
    },
  ],
  exports: [EmployeesService, IEmployeeRepository], // Export in case other modules need to interact with employees
})
export class EmployeesModule {}
