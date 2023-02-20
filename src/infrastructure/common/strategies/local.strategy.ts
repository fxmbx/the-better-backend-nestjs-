import { Strategy } from 'passport-local';

import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExceptionsService } from 'src/infrastructure/exception/exception.service';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecases-proxy';
import { UseCasesProxyModule } from 'src/infrastructure/usecase-proxy/usecases-proxy.module';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';
import { LoggerService } from 'src/infrastructure/logger/logger.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UseCasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super();
  }

  async validate(username: string, password: string) {
    if (!username || !password) {
      this.logger.warn(
        'LocalStrategy',
        `Username or password is missing, BadRequestException`,
      );
      this.exceptionService.unauthorizedException();
    }
    const user = await this.loginUsecaseProxy
      .getInstance()
      .validateUserForLocalStragtegy(username, password);
    if (!user) {
      this.logger.warn('LocalStrategy', `Invalid username or password`);
      this.exceptionService.unauthorizedException({
        message: 'Invalid username or password.',
        status: false,
      });
    }
    return user;
  }
}
