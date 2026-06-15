import { Employee } from '../entities/employee.entity';

export const IEmployeeRepository = Symbol('IEmployeeRepository');

export interface IEmployeeRepository {
  findAll(): Promise<Employee[]>;
  findAllPaginated(limit: number, offset: number): Promise<[Employee[], number]>;
  findById(id: string): Promise<Employee | null>;
  findByEmail(email: string): Promise<Employee | null>;
  save(employee: Employee): Promise<Employee>;
  update(id: string, employee: Partial<Employee>): Promise<Employee | null>;
  delete(id: string): Promise<boolean>;
}
