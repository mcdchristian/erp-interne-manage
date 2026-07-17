import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmployeesService } from '../../../employees/application/services/employees.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly employeesService: EmployeesService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: any) {
    // The payload contains the decoded JWT token.
    const user = await this.employeesService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    // We return a mapped user object to attach to request.user
    return { id: user.id, email: user.email, role: user.role };
  }
}
