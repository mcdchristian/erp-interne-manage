import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { EmployeesService } from '../src/modules/employees/application/services/employees.service';
import { EmployeeRole } from '../src/modules/employees/domain/entities/employee.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const employeesService = app.get(EmployeesService);

  try {
    const admin = await employeesService.create({
      firstName: 'Admin',
      lastName: 'System',
      email: 'admin@entreprise.com',
      password: 'Password123!',
      role: EmployeeRole.ADMIN,
      position: 'Administrateur',
      department: 'IT',
      hireDate: new Date().toISOString(),
    } as any);
    console.log('✅ Admin user created successfully:', admin.email);
  } catch (e) {
    console.log('⚠️ Could not create admin user (maybe it already exists?):', e.message);
  }

  await app.close();
}
bootstrap();
