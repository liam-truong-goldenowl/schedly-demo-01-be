import { hash, genSalt, compare } from 'bcrypt';

interface GenerateHashParams {
  source: string;
}

export async function generateHash({
  source,
}: GenerateHashParams): Promise<string> {
  const saltRounds = 10;
  const salt = await genSalt(saltRounds);

  return hash(source, salt);
}

interface VerifyHashParams {
  source: string;
  hash: string;
}

export async function verifyHash({
  source,
  hash,
}: VerifyHashParams): Promise<boolean> {
  return compare(source, hash);
}
