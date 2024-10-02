import { Role } from '@/util/Constants';
import { MessageException } from '@/util/MessageException';
import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export const UserAccess = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const UserIsAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user.role.match(Role.admin).length == 0) {
      throw new HttpException(
        new MessageException().PermissionDenided,
        HttpStatus.FORBIDDEN,
      );
    }
  },
);
