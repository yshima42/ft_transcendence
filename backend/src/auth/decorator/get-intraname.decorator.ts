import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetIntraname = createParamDecorator((_, ctx: ExecutionContext) => {
  const request: { user: { intraname: string } } = ctx
    .switchToHttp()
    .getRequest();

  return request.user.intraname;
});
