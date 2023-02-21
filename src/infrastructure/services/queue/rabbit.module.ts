import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitService } from './rabbit.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.RABBITMQ_NOTIFICATION || 'QUEUE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672',
          ],
          queue: process.env.RABBITMQ_QUEUE_NAME || 'better_event',
          queueOptions: {
            durable: false,
          },
          noAck: false,
        },
      },
    ]),
  ],
  providers: [RabbitService],
  exports: [RabbitService],
})
export class RabbitModule {}
