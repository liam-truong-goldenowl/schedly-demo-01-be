import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@/common/repositories/base.repository';

import { MeetingGuest } from '../entities/meeting-guest.entity';

@Injectable()
export class MeetingGuestRepository extends BaseRepository<MeetingGuest> {}
