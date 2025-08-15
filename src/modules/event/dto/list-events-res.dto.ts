import { createCursorBasedResDto } from '@/common/dto';

import { EventResDto } from './event-res.dto';

export class ListEventsResDto extends createCursorBasedResDto(EventResDto) {}
