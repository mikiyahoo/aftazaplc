import "server-only";

import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function getAdminAccountFromRequest(request: Request) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.sub) {
    return null;
  }

  const account = await prisma.user.findUnique({
    where: { id: token.sub },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  if (!account || account.role !== "admin") {
    return null;
  }

  return account;
}
