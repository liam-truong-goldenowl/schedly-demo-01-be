import { hash, genSalt } from 'bcrypt';

type GenerateHashParams = {
  salt?: string | number;
  source: string;
};

export async function generateHash({
  salt,
  source,
}: GenerateHashParams): Promise<string> {
  salt = salt || (await genSalt(10));

  return hash(source, salt);
}
