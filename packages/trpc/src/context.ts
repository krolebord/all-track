export type CreateContextOptions = {
  jwtSecret: string;
  token?: string;
}

export type Context = {
  user?: string;
};

export const createApiContext = async <TExternalContext>({
  jwtSecret,
  token
}: CreateContextOptions): Promise<Context & (TExternalContext | {})> => {
  return {};
};
