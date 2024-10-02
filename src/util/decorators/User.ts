import { UserAccessInterface } from '@/app/modules/auth/interface/UserAccessInterface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserAccessInterface = request.user;
    return user;
  },
);
