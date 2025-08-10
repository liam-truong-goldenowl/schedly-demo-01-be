import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { ConfigService } from '@/config/config.service';

import { User } from './entities/user.entity';
import { Event } from './entities/event.entity';
import { Account } from './entities/account.entity';
import { Schedule } from './entities/schedule.entity';
import { WeeklyHour } from './entities/weekly-hour.entity';
import { DateOverride } from './entities/date-override.entity';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => config.getOrThrow('mikroOrm'),
    }),
    MikroOrmModule.forFeature([
      User,
      Account,
      Event,
      Schedule,
      DateOverride,
      WeeklyHour,
    ]),
  ],
})
export class DatabaseModule {}
