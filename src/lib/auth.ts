import { compare } from "bcrypt";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAccountByEmail } from "@/lib/supabase/accounts";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const account = await getAccountByEmail(credentials.email);

        if (!account || !account.isActive || !account.passwordHash) {
          return null;
        }

        const isValid = await compare(credentials.password, account.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: account.id,
          email: account.email,
          name: account.name ?? undefined,
          role: account.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role ?? "user";
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};
