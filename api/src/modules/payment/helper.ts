import crypto from 'crypto';

/**
 * Generates a Base64-encoded HMAC SHA256 hash.
 *
 * @param {string} data - The data to be hashed.
 * @param {string} secret - The secret key used for hashing.
 * @returns {string} The Base64-encoded HMAC SHA256 hash.
 */
export function generateHmacSha256Hash(data: string, secret: string): string {
  if (!data || !secret) {
    throw new Error('Both data and secret are required to generate a hash.');
  }

  // Create HMAC SHA256 hash and encode it in Base64
  const hash = crypto.createHmac('sha256', secret).update(data).digest('base64');

  //
  return hash;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeStringify(obj: any) {
  const cache = new Set();
  const jsonString = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return;
      }
      cache.add(value);
    }

    return value;
  });

  //
  return jsonString;
}

/**
 * Decode Payment Info
 */
export function decodeEsewaPaymentInfo(encoded: string) {
  const decodedData = atob(encoded);

  return JSON.parse(decodedData);
}
