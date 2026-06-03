import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { IEmployeeRepository } from '../../../employees/domain/repositories/employee.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IEmployeeRepository)
    private readonly employeeRepository: IEmployeeRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const employee = await this.employeeRepository.findByEmail(loginDto.email);
    if (!employee) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, employee.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: employee.email, sub: employee.id, role: employee.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: employee.id,
        email: employee.email,
        role: employee.role,
      }
    };
  }
}
