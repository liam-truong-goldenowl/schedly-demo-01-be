import { OmitType } from '@nestjs/swagger';

import { CreateDateOverrideDto } from './create-date-override.dto';

export class UpdateDateOverrideDto extends OmitType(CreateDateOverrideDto, [
  'date',
]) {}
