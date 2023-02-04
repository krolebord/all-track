import type { Prisma, PrismaClient, PrismaPromise } from "@prisma/client/edge";
import type { ColumnType } from "kysely";
import type { CamelCase } from 'type-fest';

type BaseModel<T extends {
  findFirst: (...args: any[]) => any;
  create: (...args: any[]) => any;
}> = T;

type ModelTable<ModelName extends Prisma.ModelName> = PrismaClient[CamelCase<ModelName>] extends BaseModel<infer Model> ? {
  select: ReturnType<Model['findFirst']> extends PrismaPromise<infer T>
    ? NonNullable<T>
    : never;
  insert: Parameters<Model['create']>[0]['data'];
} : never;

type KyselyTable<ModelName extends Prisma.ModelName, Table extends ModelTable<ModelName>> = {
  [P in keyof Table['select']]: ColumnType<
    Table['select'][P],
    Table['insert'][P]
  >;
};

export type Types = {
  [Model in Prisma.ModelName]: ModelTable<Model>;
}

export type Schema = {
  [Model in Prisma.ModelName]: KyselyTable<Model, Types[Model]>;
}
