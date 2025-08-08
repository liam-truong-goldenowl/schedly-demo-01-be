import { customAlphabet } from 'nanoid';
import { Injectable } from '@nestjs/common';

import { UUID_LENGTH, CHARACTER_SET } from './config';

@Injectable()
export class UUIDService {
  private readonly generateUUID = customAlphabet(CHARACTER_SET, UUID_LENGTH);

  async generate(): Promise<string> {
    return this.generateUUID();
  }
}
