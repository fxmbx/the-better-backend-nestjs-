import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { ExceptionsModule } from './infrastructure/exception/exception.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module';
import { UseCasesProxyModule } from './infrastructure/usecase-proxy/usecases-proxy.module';
import { JwtModule as JwtServiceModule } from './infrastructure/services/jwt/jwt.module';
import { LocalStrategy } from './infrastructure/common/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './infrastructure/common/strategies/rt.strategy';
import { MessageGatewayModule } from './infrastructure/gateway/gateway.module';
import { NotificatoinModule } from './infrastructure/services/notificatoin/notification.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'secret-1',
    }),
    LoggerModule,
    ExceptionsModule,
    UseCasesProxyModule.register(),
    ControllersModule,
    BcryptModule,
    JwtServiceModule,
    MessageGatewayModule,
    NotificatoinModule,
  ],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AppModule {}
