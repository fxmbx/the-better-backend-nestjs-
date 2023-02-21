import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IQueueInterface } from 'src/domain/adapter/queue.interface';

const RABBITMQ_NOTIFICATION =
  process.env.RABBITMQ_NOTIFICATION || 'QUEUE_SERVICE';
@Injectable()
export class RabbitService implements IQueueInterface {
  constructor(
    @Inject(RABBITMQ_NOTIFICATION)
    private readonly rabbitClientProxy: ClientProxy,
  ) {}
  async publish(topic: string, messgae: any): Promise<void> {
    await this.rabbitClientProxy.emit(topic, messgae);
    return;
  }
}
