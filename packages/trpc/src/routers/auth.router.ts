import type { Db, UserEmailProvider } from "@all-track/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { fetchVerifiedUserEmail } from "../auth/email-utils";
import { generateUserToken } from "../auth/jwt-utils";
import { authorizedProcedure } from "../procedures";
import { t } from "../trpc";

type NewUser = {
  provider: UserEmailProvider;
  email: string;
}

const createUser = async (db: Db, user: NewUser) => await db.user
  .create({
    data: {
      id: crypto.randomUUID(),
      email: user.email,
      emailProvider: user.provider
    },
    select: {
      id: true,
      emailProvider: true,
      email: true
    }
  });

const getUserByEmail = async (db: Db, email: string) => await db.user
  .findFirst({
    where: { email },
    select: {
      id: true,
      emailProvider: true,
      email: true
    }
  });

export const authRouter = t.router({
  loginWithExternalProvider: t.procedure
    .input(z.object({
      email: z.string().email(),
      token: z.discriminatedUnion('provider', [
        z.object({ provider: z.literal('Google'), token: z.string().min(1) }),
        z.object({ provider: z.literal('GitHub'), token: z.string().min(1) }),
      ])
    }))
    .mutation(async ({
      input: { email, token },
      ctx: { db, jwt }
    }) => {
      const userEmailResult = await fetchVerifiedUserEmail(token.provider, token.token);

      if (userEmailResult.status !== 'ok') {
        return { status: userEmailResult.status } as const;
      }

      if (userEmailResult.email !== email) {
        return { status: 'email-mismatch' } as const;
      }

      let user = await getUserByEmail(db, email);
      
      if (!user) {
        user = await createUser(db, { 
          provider: token.provider,
          email: email,
        });
      }

      if (!user) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }

      const apiToken = await generateUserToken(jwt.secret, user);

      return { status: 'ok', user, apiToken } as const;
    }),
  info: authorizedProcedure
    .input(z.void())
    .query(async ({ ctx: { user } }) => {
      return user;
    })
});
