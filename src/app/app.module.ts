import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig } from '@/config/app';
import { jwtConfig } from '@/config/jwt';
import { MikroOrm } from '@/config/mikro-orm';
import { EnvSchema } from '@/config/env.schema';
import { swaggerConfig } from '@/config/swagger';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { DatabaseModule } from '@/database/database.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, MikroOrm, swaggerConfig, jwtConfig],
      validationSchema: EnvSchema,
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
