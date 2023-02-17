import hkdf from "@panva/hkdf";
import { EncryptJWT, jwtDecrypt } from "jose";
import { z } from "zod";

type TokenUser = z.infer<typeof tokenScheme>;

const tokenScheme = z.object({
  id: z.string(),
  email: z.string().email(),
  emailProvider: z.string(),
});

const getDerivedEncryptionKey = async (secret: string) => {
  return await hkdf("sha256", secret, "", "Encryption Key", 32);
}

export const generateUserToken = async (secret: string, user: TokenUser) => {
  const key = await getDerivedEncryptionKey(secret);
  return await new EncryptJWT(user)
    .setIssuedAt()
    .setJti(crypto.randomUUID())
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(key);
};

export const validateUserToken = async (secret: string, token: string) => {
  if (!token) {
    return null;
  }

  const key = await getDerivedEncryptionKey(secret);

  const { payload } = await jwtDecrypt(token, key, { clockTolerance: 15 });

  const validatedPayload = tokenScheme.safeParse(payload);

  if (!validatedPayload.success) {
    return null;
  }

  return validatedPayload.data;
}

export const validateRequest = async (request: Request, secret: string) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  return await validateUserToken(secret, token);
}
