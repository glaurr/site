import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { loginSchema } from "./schemas";

/*
  only one account for admin - is not a database row:
  it is ADMIN_EMAIL plus ADMIN_PASSWORD_HASH from the environment;
  that keeps logging in from waking the Neon compute, and removes a table whose only
  row would be seeded from those same variables anyway
*/
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminEmail || !adminPasswordHash) {
          throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD_HASH are not set");
        }

        /*
          Both checks run before either is acted on. Returning early on a wrong
          email would answer faster than a wrong password, which tells an
          attacker which half they got right.

          I WILL UPDATE THIS IN A LATER UPDATE TO BE EVEN BETTER
        */
        const emailMatches =
          parsed.data.email.toLowerCase() === adminEmail.toLowerCase();
        const passwordMatches = await bcrypt.compare(
          parsed.data.password,
          adminPasswordHash,
        );

        if (!emailMatches || !passwordMatches) return null;

        return { id: "admin", email: adminEmail };
      },
    }),
  ],
});

/* this HAS to be called in admin server actions */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session;
}
