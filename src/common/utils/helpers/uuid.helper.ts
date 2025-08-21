import { customAlphabet } from 'nanoid';

export class UUIDHelper {
  private static readonly CHARACTER_SET =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  private static readonly UUID_LENGTH = 8;

  static async generate(): Promise<string> {
    return customAlphabet(this.CHARACTER_SET, this.UUID_LENGTH)();
  }
}
