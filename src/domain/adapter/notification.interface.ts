import { RmqContext } from '@nestjs/microservices';

export interface INotification {
  pushnotifiaction(data: any);
  email(to: string, subject: string, body: any, context: RmqContext);
}
