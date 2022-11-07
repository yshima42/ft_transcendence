import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request: { user: { user: User } } = ctx.switchToHttp().getRequest();

  return request.user.user;
});
