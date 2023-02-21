import { BadRequestException, Injectable } from '@nestjs/common';
import { INotification } from 'src/domain/adapter/notification.interface';
import * as nodeMailer from 'nodemailer';
import axios, { AxiosRequestConfig } from 'axios';
import { RmqContext } from '@nestjs/microservices';

const EMAIL_TEMPLATES_PATH = `${process.cwd()}/src/mail`;
const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.come',
  port: 465,
  secure: true,
  tls: { ciphers: 'SSLv3' },
  auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD },
});

@Injectable()
export class NotificationService implements INotification {
  async email(to: string, subject: string, body: any, context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await transporter.sendMail({
        to: to,
        from: `${process.env.EMAIL_ADDRESS}`,
        body: body,
        subject: subject,
      });
      channel.ack(originalMsg);
    } catch (e) {
      channel.nack(originalMsg);
      throw e;
    }
  }
  async pushnotifiaction(data: any) {
    const { user, message, title } = data;
    const options = {
      url: process.env.FIRE_BASE_URL,
      headers: {
        Authorization: process.env.FIRE_BASE_KEY,
      },
      method: 'post',
      data: {
        to: '/topics/' + user,
        notification: {
          body: message,
          title: title,
        },
        data: {
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          body: message,
          title: title,
          key_1: 'Value for key_1',
          key_2: 'Value for key_2',
        },
      },
    };
    await this.sendRequest(options);
  }

  private async sendRequest(requestConfig: AxiosRequestConfig): Promise<any> {
    try {
      const response = await axios(requestConfig);
      return response.data;
    } catch (err) {
      throw new BadRequestException(
        err.response.data.message || err.response.data.error,
      );
    }
  }
}
