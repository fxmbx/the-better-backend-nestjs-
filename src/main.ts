import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './infrastructure/common/filters/exception.filter';
import { LoggingInterceptor } from './infrastructure/common/interceptors/logger.interceptor';
import { ResponseInterceptor } from './infrastructure/common/interceptors/response.interceptors';
import { LoggerService } from './infrastructure/logger/logger.service';
import { RedisIoAdapter } from './infrastructure/services/socket/redis-io';
import { swaggerSetUp } from './infrastructure/swagger/swagger';

async function bootstrap() {
  console.log(process.env.JWT_SECRET);

  const app = await NestFactory.create(AppModule);

  const redisIoAdapter = new RedisIoAdapter(app);
  redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor());

  if (process.env.NODE_ENV !== 'production') {
    swaggerSetUp(app);
  }
  await app.listen(3090);
}
bootstrap();
