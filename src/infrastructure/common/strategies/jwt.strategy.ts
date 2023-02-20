import { Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecases-proxy';
import { UseCasesProxyModule } from 'src/infrastructure/usecase-proxy/usecases-proxy.module';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { ExceptionsService } from 'src/infrastructure/exception/exception.service';
import { Request } from 'express';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(UseCasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: 'secret-1',
    });
  }

  async validate(payload: any) {
    const user = this.loginUsecaseProxy
      .getInstance()
      .validateUserForJWTStragtegy(payload.username);
    if (!user) {
      this.logger.warn('JwtStrategy', `User not found`);
      this.exceptionService.unauthorizedException({
        message: 'User not found',
        status: false,
      });
    }
    return user;
  }
}
