import { Module } from '@nestjs/common';
import { ConfigModule, ConfigFactory } from '@nestjs/config';

import { appConfig } from '@/config/app';
import { jwtConfig } from '@/config/jwt';
import { MikroOrm } from '@/config/mikro-orm';
import { swaggerConfig } from '@/config/swagger';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { DatabaseModule } from '@/database/database.module';

import { AppController } from './app.controller';

const confLoaders: ConfigFactory[] = [
  MikroOrm,
  appConfig,
  jwtConfig,
  swaggerConfig,
];

@Module({
  providers: [],
  controllers: [AppController],
  imports: [
    AuthModule,
    UserModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true, load: confLoaders }),
  ],
})
export class AppModule {}
