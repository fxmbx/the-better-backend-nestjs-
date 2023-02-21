import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UseCasesProxyModule } from '../usecase-proxy/usecases-proxy.module';
import { AuthController } from './auth/auth.controller';
import { CampiagnController } from './campaign/campaign.controller';
import { CatsController } from './cat/cat.controller';
import { NotificationController } from './notification/notificatoin.controller';

@Module({
  imports: [UseCasesProxyModule.register()],
  controllers: [
    CatsController,
    AuthController,
    CampiagnController,
    NotificationController,
  ],
})
export class ControllersModule {}
