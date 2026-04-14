import * as argon2 from "argon2"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, username } from "better-auth/plugins"
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
  user: {
    additionalFields: {
      role: {
        type: ["user", "admin"],
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
  rateLimit: {
    window: 60,
    max: 10,
  },
  session: {
    strategy: "jwt",
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      maxAge: 5 * 60,
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    username({
      minUsernameLength: 3,
      maxUsernameLength: 20,
      // 3. Validate the username before creation
      usernameValidator: (name) => {
        const reservedNames = ["admin", "administrator", "root", "system"]

        // Return false if the requested username is in our reserved list (case-insensitive)
        if (reservedNames.includes(name.toLowerCase())) {
          return false
        }

        // Optional: Ensure the username only contains letters, numbers, and underscores
        return /^[a-zA-Z0-9_]+$/.test(name)
      },
    }),
  ],
})
