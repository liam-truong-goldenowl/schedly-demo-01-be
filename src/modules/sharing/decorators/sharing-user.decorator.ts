import { Param } from '@nestjs/common';

import { USER_SLUG_PARAM } from '../sharing.config';
import { GetUserFromSlugPipe } from '../pipes/get-user-from-slug.pipe';

export const SharingUser = () => Param(USER_SLUG_PARAM, GetUserFromSlugPipe);
