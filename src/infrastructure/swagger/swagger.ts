import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseFormat } from '../common/interceptors/response.interceptors';

export const swaggerSetUp = (app: INestApplication) => {
  const option = new DocumentBuilder()
    .setTitle('demo api')
    .setDescription('Integrations')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, option, {
    extraModels: [ResponseFormat],
    deepScanRoutes: true,
  });
  SwaggerModule.setup('docs', app, document);
};
