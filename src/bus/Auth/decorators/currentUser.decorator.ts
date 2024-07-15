// Core
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Tools
import { IJwtPayload } from '../auth.interfaces';

export const CurrentUser = createParamDecorator(
  (data: keyof IJwtPayload | undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.user.userId;
  },
);
