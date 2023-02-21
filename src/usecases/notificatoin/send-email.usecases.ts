import { HttpException, HttpStatus } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { INotification } from 'src/domain/adapter/notification.interface';
import { IUseCaseResponse } from 'src/domain/adapter/use.case.response.interface';
import { ILogger } from 'src/domain/logger/logger.interface';

export class SendEmailUseCases {
  constructor(
    private readonly notificationService: INotification,
    private readonly logger: ILogger,
  ) {}

  async welcomeEmail(data: {
    to: string;
    subject: string;
    body: any;
    context: RmqContext;
  }): Promise<IUseCaseResponse> {
    try {
      await this.notificationService.email(
        data.to,
        data.subject,
        data.body,
        data.context,
      );
      this.logger.log('welcome email', `welcome email sent to ${data.to}`);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      data: {
        message: 'email sent succesfully',
      },
    };
  }
}
