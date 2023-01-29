import { createDb } from "@all-track/db"

export type CreateContextOptions = {
  db: {
    host: string;
    username: string;
    password: string;
  }
}

export type Context = Awaited<ReturnType<typeof createApiContext>>;

export const createApiContext = async ({
  db: dbSettings,
}: CreateContextOptions) => {
  const db = createDb(dbSettings);
  return { db };
};
