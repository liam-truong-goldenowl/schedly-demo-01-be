import './instrument';

import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { ValidationException } from './common/exceptions/app.exception';
import { AllExceptionsFilter } from './common/filters/app-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow('app');

  if (appConfig.isDev) {
    const swaggerConfig = configService.getOrThrow('swagger');
    const docConfig = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setVersion(swaggerConfig.version)
      .setDescription(swaggerConfig.description)
      .addBearerAuth()
      .build();
    const doc = SwaggerModule.createDocument(app, docConfig);
    SwaggerModule.setup(swaggerConfig.path, app, doc);
  }

  app.setGlobalPrefix('v1/api');

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.enableCors({ origin: appConfig.corsOrigins, credentials: true });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints
            ? error.constraints[Object.keys(error.constraints)[0]]
            : 'Invalid value',
        }));
        return new ValidationException(result);
      },
      stopAtFirstError: true,
    }),
  );

  /**
   * Enables graceful shutdown for the application to let Mikro ORM perform cleanup.
   * See: https://mikro-orm.io/docs/usage-with-nestjs#app-shutdown-and-cleanup
   */
  app.enableShutdownHooks();

  await app.listen(appConfig.port);
}

void bootstrap();
