import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@/common/repositories/base.repository';

import { Meeting } from '../entities/meeting.entity';

@Injectable()
export class MeetingRepository extends BaseRepository<Meeting> {}
