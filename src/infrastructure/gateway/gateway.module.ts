import { Module } from '@nestjs/common';
import { MessgaeGateway } from './message.gateway';

@Module({
  providers: [MessgaeGateway],
})
export class MessageGatewayModule {}
