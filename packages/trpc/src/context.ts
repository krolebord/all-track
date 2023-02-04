import { createDb } from "@all-track/db"
import { validateRequest } from "./auth/jwt-utils";

export type CreateContextOptions = {
  request: Request;
  jwt: {
    secret: string;
  },
  db: {
    host: string;
    username: string;
    password: string;
  }
}

export type Context = Awaited<ReturnType<typeof createApiContext>>;

export const createApiContext = async ({
  request,
  db: dbSettings,
  jwt
}: CreateContextOptions) => {
  const user = await validateRequest(request, jwt.secret);
  const db = createDb(dbSettings);
  
  return {
    request,
    jwt,
    db,
    user
  };
};
