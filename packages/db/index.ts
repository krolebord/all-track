import type { Entry } from "@prisma/client/edge";
import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";

interface Schema {
  Entry: Entry;
}

type DbOptions = {
  host: string;
  username: string;
  password: string;
};

export type Db = Kysely<Schema>;

export const createDb = ({ host, username, password }: DbOptions): Db => new Kysely<Schema>({
  dialect: new PlanetScaleDialect({
    host: host,
    username: username,
    password: password,
  }),
});
