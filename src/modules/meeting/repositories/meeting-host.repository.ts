import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@/common/repositories/base.repository';

import { MeetingHost } from '../entities/meeting-host.entity';

@Injectable()
export class MeetingHostRepository extends BaseRepository<MeetingHost> {}
