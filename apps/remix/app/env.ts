import { z } from "zod";

const clientEnvScheme = z.object({
  ENV_MODE: z.enum(["development", "production"]),
});

export const clientConfig = clientEnvScheme.parse({
  ENV_MODE
});
