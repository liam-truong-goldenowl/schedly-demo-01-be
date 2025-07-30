import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateDateOverrideDto } from './create-date-override.dto';

export class DateOverrideDto extends PartialType(
  OmitType(CreateDateOverrideDto, ['date']),
) {}
