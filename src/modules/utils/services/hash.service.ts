import { Injectable } from '@nestjs/common';
import { genSalt, hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

@Injectable()
export class HashService {
  private readonly SALT_ROUNDS = 10;

  async generate(source: string): Promise<string> {
    const salt = await genSalt(this.SALT_ROUNDS);
    return bcryptHash(source, salt);
  }

  async verify(source: string, hashedValue: string): Promise<boolean> {
    return bcryptCompare(source, hashedValue);
  }
}
