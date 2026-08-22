import * as bcrypt from 'bcrypt';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, storedHash);
}
