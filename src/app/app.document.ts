import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import type { INestApplication } from '@nestjs/common';

import { ConfigService } from '@/config';

export const genAPIDocument = (app: INestApplication) => {
  const configService = app.get(ConfigService);

  const swaggerConfig = configService.getOrThrow('swagger');

  const docPath = swaggerConfig.path;
  const docConfig = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setVersion(swaggerConfig.version)
    .setDescription(swaggerConfig.description)
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, docConfig, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup(docPath, app, doc);
};
