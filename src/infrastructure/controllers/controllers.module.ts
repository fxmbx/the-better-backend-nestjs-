import { Module } from '@nestjs/common';
import { UseCasesProxyModule } from '../usecase-proxy/usecases-proxy.module';
import { AuthController } from './auth/auth.controller';
import { CampiagnController } from './campaign/campaign.controller';
import { CatsController } from './cat/cat.controller';

@Module({
  imports: [UseCasesProxyModule.register()],
  controllers: [CatsController, AuthController, CampiagnController],
})
export class ControllersModule {}
