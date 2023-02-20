import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import JwtRefreshGuard from 'src/infrastructure/common/guards/jwt-rf.guard';
import { LoginGuard } from 'src/infrastructure/common/guards/login.guard';
import { ValidateCreateUserPipe } from 'src/infrastructure/common/pipes/register-user.pipe';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecases-proxy';
import { UseCasesProxyModule } from 'src/infrastructure/usecase-proxy/usecases-proxy.module';

import { LoginUseCases } from 'src/usecases/auth/login.usecases';
import { RegisterUseCases } from 'src/usecases/auth/register.usecases';
import { LoginDto, RegisterDto } from './auth-dto';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was  found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
export class AuthController {
  constructor(
    @Inject(UseCasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    @Inject(UseCasesProxyModule.REGISTER_USECASES_PROXY)
    private readonly registerUseCaseProxy: UseCaseProxy<RegisterUseCases>,
  ) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiOperation({ description: 'register' })
  async register(@Body(ValidateCreateUserPipe) data: RegisterDto) {
    const res = await this.registerUseCaseProxy
      .getInstance()
      .createUserUseCase(data);
    console.log(res.data);
  }
  @Post('login')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
  @ApiBody({ type: LoginDto })
  @ApiOperation({ description: 'login' })
  async login(@Body() auth: LoginDto, @Request() request: any) {
    const accessTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtToken(auth.username);
    const refreshTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtRefreshToken(auth.username);
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return 'Login successful';
  }
  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  async refresh(@Req() request: any) {
    console.log(request.user.username);
    const accessTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtToken(request.user.username);
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return 'Refresh successful';
  }
}
