import { PrismaClient } from "@prisma/client/edge";


type DbOptions = {
  url: string;
};

export type Db = PrismaClient;

export const createDb = ({ url }: DbOptions) => {
  return new PrismaClient({
    datasources: { db: { url } }
  });
};

export * from '@prisma/client/edge';
