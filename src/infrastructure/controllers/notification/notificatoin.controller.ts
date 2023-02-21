import { Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecases-proxy';
import { UseCasesProxyModule } from 'src/infrastructure/usecase-proxy/usecases-proxy.module';
import { SendEmailUseCases } from 'src/usecases/notificatoin/send-email.usecases';

@Controller('notification')
export class NotificationController {
  constructor(
    @Inject(UseCasesProxyModule.SEND_EMAIL_USECASES_PROXY)
    private readonly sendEmailProxy: UseCaseProxy<SendEmailUseCases>,
  ) {}

  @EventPattern('welcome_email')
  async welcome(@Payload() data, @Ctx() rmqctx: RmqContext) {
    data.context = rmqctx;
    return await this.sendEmailProxy.getInstance().welcomeEmail(data);
  }
}
