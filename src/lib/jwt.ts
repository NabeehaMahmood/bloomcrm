import { jwtVerify, SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || '');

export async function createToken(payload: any, expiresIn = '24h'): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(secret);

  return token;
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (err) {
    return null;
  }
}
