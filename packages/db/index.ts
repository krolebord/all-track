import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import type { Schema, Types } from "./schema";
import { Merge } from "type-fest";
import { UserEmailProvider } from "@prisma/client";

type DbOptions = {
  host: string;
  username: string;
  password: string;
};

export type Db = Kysely<Schema>;

export type DbTypes = Merge<
  Types,
  {
    UserEmailProvider: UserEmailProvider
  }
>;

export const createDb = ({ host, username, password }: DbOptions): Db => new Kysely<Schema>({
  dialect: new PlanetScaleDialect({
    host: host,
    username: username,
    password: password,
  }),
});
