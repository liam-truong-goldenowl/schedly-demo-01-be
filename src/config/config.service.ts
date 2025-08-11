import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import type { Config } from './config.interface';

@Injectable()
export class ConfigService extends NestConfigService<Config> {
  override get<K extends keyof Config>(key: K): Config[K] | undefined {
    return super.get(key) as Config[K];
  }

  override getOrThrow<K extends keyof Config>(key: K): Config[K] {
    return super.getOrThrow(key) as Config[K];
  }
}
