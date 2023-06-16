import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { MessgaeGateway } from './message.gateway';

@Module({
  imports: [LoggerModule],
  providers: [MessgaeGateway],
})
export class MessageGatewayModule {}
