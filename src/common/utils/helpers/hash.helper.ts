import { genSalt, hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

export class HashHelper {
  private static readonly SALT_ROUNDS = 10;

  static async generate(source: string): Promise<string> {
    const salt = await genSalt(this.SALT_ROUNDS);
    return bcryptHash(source, salt);
  }

  static async verify(source: string, hashedValue: string): Promise<boolean> {
    return bcryptCompare(source, hashedValue);
  }
}
