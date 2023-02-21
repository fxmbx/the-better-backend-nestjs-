import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
// import { ILogger } from 'src/domain/logger/logger.interface';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';
import { RegisterUseCases } from 'src/usecases/auth/register.usecases';
import { CreateCampaignUseCases } from 'src/usecases/campaign/create.campaign.usecases';
import { catUseCases } from 'src/usecases/cats/create-cat.usecase';
import { SendEmailUseCases } from 'src/usecases/notificatoin/send-email.usecases';
import { ExceptionsModule } from '../exception/exception.module';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';
import { CampaignRepository } from '../repositories/campaign.repository';
import { CatRepository } from '../repositories/cat.repository';
import { RepositoriesModule } from '../repositories/repository.module';
import { UserRepository } from '../repositories/user.repository';
import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { JwtModule } from '../services/jwt/jwt.module';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { NotificatoinModule } from '../services/notificatoin/notification.module';
import { NotificationService } from '../services/notificatoin/notification.service';
import { RabbitModule } from '../services/queue/rabbit.module';
import { RabbitService } from '../services/queue/rabbit.service';
import { RedisCacheModule } from '../services/redis/redis-cache.module';
import { S3UploadModule } from '../services/s3upload/s3-upload.module';
import { S3UploadService } from '../services/s3upload/s3-upload.service';
import { UseCaseProxy } from './usecases-proxy';

@Module({
  imports: [
    LoggerModule,
    JwtModule,
    BcryptModule,
    RepositoriesModule,
    ExceptionsModule,
    S3UploadModule,
    RabbitModule,
    NotificatoinModule,
    RedisCacheModule,
  ],
})
export class UseCasesProxyModule {
  static CAT_USECASES_PROXY = 'CatUsecasesProxy';
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static REGISTER_USECASES_PROXY = 'RegisterUseCasesProxy';
  static CREATE_CAMPAIGN_USECASES_PROXY = 'CreatCampiagnUseCasesProxy';
  static SEND_EMAIL_USECASES_PROXY = 'SendEmailUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyModule,
      providers: [
        {
          inject: [LoggerService, CatRepository],
          provide: UseCasesProxyModule.CAT_USECASES_PROXY,
          useFactory: (logger: LoggerService, catRepository: CatRepository) =>
            new UseCaseProxy(new catUseCases(catRepository, logger)),
        },
        {
          inject: [
            LoggerService,
            JwtTokenService,
            UserRepository,
            BcryptService,
          ],
          provide: UseCasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            userRepo: UserRepository,
            bcryptService: BcryptService,
            rabbitMqProvide: RabbitService,
          ) =>
            new UseCaseProxy(
              new LoginUseCases(
                logger,
                jwtTokenService,
                userRepo,
                bcryptService,
                rabbitMqProvide,
              ),
            ),
        },
        {
          inject: [LoggerService, UserRepository, BcryptService],
          provide: UseCasesProxyModule.REGISTER_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            userRepository: UserRepository,
            bcrypt: BcryptService,
          ) =>
            new UseCaseProxy(
              new RegisterUseCases(logger, userRepository, bcrypt),
            ),
        },
        {
          inject: [LoggerService, CampaignRepository, S3UploadService],
          provide: UseCasesProxyModule.CREATE_CAMPAIGN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            campignRepo: CampaignRepository,
            uploadService: S3UploadService,
          ) =>
            new UseCaseProxy(
              new CreateCampaignUseCases(campignRepo, uploadService, logger),
            ),
        },
        {
          inject: [LoggerService, NotificationService],
          provide: UseCasesProxyModule.SEND_EMAIL_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            notification: NotificationService,
          ) => new UseCaseProxy(new SendEmailUseCases(notification, logger)),
        },
      ],
      exports: [
        UseCasesProxyModule.CAT_USECASES_PROXY,
        UseCasesProxyModule.LOGIN_USECASES_PROXY,
        UseCasesProxyModule.REGISTER_USECASES_PROXY,
        UseCasesProxyModule.CREATE_CAMPAIGN_USECASES_PROXY,
        UseCasesProxyModule.SEND_EMAIL_USECASES_PROXY,
      ],
    };
  }
}
