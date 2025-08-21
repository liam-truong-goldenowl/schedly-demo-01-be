import { Injectable } from '@nestjs/common';

import { BaseRepository } from '@/common/repositories/base.repository';

import { MeetingInvitee } from '../entities/meeting-invitee.entity';

@Injectable()
export class MeetingInviteeRepository extends BaseRepository<MeetingInvitee> {}
