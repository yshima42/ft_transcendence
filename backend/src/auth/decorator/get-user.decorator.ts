import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request: { user: string } = ctx.switchToHttp().getRequest();

  return request.user;
});
