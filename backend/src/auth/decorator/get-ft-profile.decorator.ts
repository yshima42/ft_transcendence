import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FtProfile } from '../interfaces/ft-profile.interface';

export const GetFtProfile = createParamDecorator((_, ctx: ExecutionContext) => {
  const request: { user: { ftProfile: FtProfile } } = ctx
    .switchToHttp()
    .getRequest();

  return request.user.ftProfile;
});
