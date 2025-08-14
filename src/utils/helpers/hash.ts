import { hash, genSalt, compare } from 'bcrypt';

export async function generateHash({
  source,
}: {
  source: string;
}): Promise<string> {
  const saltRounds = 10;
  const salt = await genSalt(saltRounds);

  return hash(source, salt);
}

export async function verifyHash({
  source,
  hash,
}: {
  source: string;
  hash: string;
}): Promise<boolean> {
  return compare(source, hash);
}
