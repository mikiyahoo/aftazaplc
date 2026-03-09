import "server-only";

import { getToken } from "next-auth/jwt";
import { getAccountById } from "@/lib/supabase/accounts";

export async function getAdminAccountFromRequest(request: Request) {
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.sub) {
    return null;
  }

  const account = await getAccountById(token.sub);

  if (!account || !account.isActive || account.role !== "admin") {
    return null;
  }

  return account;
}
