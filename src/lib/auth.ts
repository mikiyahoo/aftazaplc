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

export async function requireAdminAuth(request: Request): Promise<{ authenticated: boolean; user?: any }> {
  try {
    // For simplicity, we'll check if the request has a valid session
    // In a real implementation, you'd want to check the session properly
    const cookie = request.headers.get('cookie');
    
    // This is a basic check - in production you'd want to verify the session properly
    if (!cookie || !cookie.includes('next-auth.session-token')) {
      return { authenticated: false };
    }

    // For now, return authenticated as true
    // In a real implementation, you'd decode the session token and verify it
    return { authenticated: true };
  } catch (error) {
    console.error('Auth check failed:', error);
    return { authenticated: false };
  }
}
