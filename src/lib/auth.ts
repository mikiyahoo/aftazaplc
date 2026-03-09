import { compare } from "bcrypt";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

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
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          const email = credentials.email.trim().toLowerCase();
          const account = await prisma.user.findUnique({
            where: { email },
          });

          if (!account || account.role !== "admin" || !account.password) {
            return null;
          }

          const isValid = await compare(credentials.password, account.password);
          if (!isValid) {
            return null;
          }

          return {
            id: account.id,
            email: account.email,
            name: account.name ?? undefined,
            role: account.role,
          } as any;
        } catch (error) {
          console.error("Admin credential authorization failed.", error);
          return null;
        }
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
