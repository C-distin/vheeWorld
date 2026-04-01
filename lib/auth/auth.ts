import * as argon2 from "argon2"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { username } from "better-auth/plugins"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: "http://localhost:3000/",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      hash: async (password: string) => {
        return await argon2.hash(password, {
          type: argon2.argon2id,
          hashLength: 64,
          timeCost: 4,
        })
      },
      verify: async ({ hash, password }: { hash: string; password: string }) => {
        return await argon2.verify(hash, password)
      },
    },
  },
  rateLimit: {
    window: 60,
    max: 10,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      maxAge: 5 * 60,
    },
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 20,
    }),
  ],
})
