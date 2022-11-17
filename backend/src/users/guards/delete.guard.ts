import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class DeleteGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req: Request & { params: { id: string }; user: { user: User } } = ctx
      .switchToHttp()
      .getRequest();
    const urlUserId = req.params.id;
    const cookieUserId = req.user.user.id;

    return req.method !== 'DELETE' || urlUserId === cookieUserId;
  }
}
