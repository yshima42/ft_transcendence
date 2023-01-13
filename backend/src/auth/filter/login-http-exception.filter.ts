import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch(HttpException)
export class LoginHttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly config: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    void exception;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const frontendUrl = this.config.get<string>('FRONTEND_URL') as string;

    response.redirect(`${frontendUrl}`);
  }
}
