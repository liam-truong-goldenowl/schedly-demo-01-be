import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@/common/repositories/base.repository';

import { DateOverride } from '../entities/date-override.entity';

@Injectable()
export class DateOverrideRepository extends BaseRepository<DateOverride> {}
