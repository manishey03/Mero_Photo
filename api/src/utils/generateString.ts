import crypto from 'crypto';

export function generateRandomString(): string {
  return crypto
    .randomBytes(Math.ceil(10 / 2))
    .toString('hex')
    .slice(0, 10);
}
