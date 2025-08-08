import { ConfigService } from '@nestjs/config';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';

import type { INestApplication } from '@nestjs/common';

import type { Config } from '@/config/conf-factory';

export const genAPIDocument = (app: INestApplication) => {
  const confService = app.get(ConfigService);
  const conf = confService.getOrThrow<Config['swagger']>('swagger');

  const docConf = new DocumentBuilder()
    .setTitle(conf.title)
    .setVersion(conf.version)
    .setDescription(conf.description)
    .addBearerAuth()
    .build();

  const docOpts: SwaggerDocumentOptions = { deepScanRoutes: true };
  const customOpts: SwaggerCustomOptions = { customSiteTitle: conf.siteTitle };

  const doc = SwaggerModule.createDocument(app, docConf, docOpts);

  SwaggerModule.setup('api/documentation', app, doc, customOpts);
};
