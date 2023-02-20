import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ILogger } from 'src/domain/logger/logger.interface';

let fields: Array<string> = [];

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly logger: ILogger) {}
  use(req: Request, res: Response, next: (error?: any) => void) {
    const { authorization } = req.headers;
    if (!authorization) {
      this.logger.warn('AuthMiddleware', 'auth header not present');
      throw new HttpException(
        { message: 'Missing auth header' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    fields = authorization.split(' ');
    if (fields[0].toLowerCase() != 'bearer') {
      this.logger.warn('AuthMiddleware', 'invalid header type present');
      throw new HttpException(
        'invalid authorization token',
        HttpStatus.UNAUTHORIZED,
      );
    }
    next();
  }
}
