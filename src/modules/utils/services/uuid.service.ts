import { customAlphabet } from 'nanoid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UUIDService {
  private readonly CHARACTER_SET =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  private readonly UUID_LENGTH = 8;

  async generate(): Promise<string> {
    return customAlphabet(this.CHARACTER_SET, this.UUID_LENGTH)();
  }
}
