// Core
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Services
import { UserService } from 'src/bus/User/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) return true;

    const { userId } = context.switchToHttp().getRequest().user;

    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return this.matchRoles(roles, user.role);
  }
}
