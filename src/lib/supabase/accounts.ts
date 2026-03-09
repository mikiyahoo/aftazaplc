import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";

const ACCOUNTS_TABLE = "accounts";

export interface AdminAccountRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string | null;
  role: string;
  isActive: boolean;
}

function normalizeBoolean(value: unknown, fallback = true) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "t", "1", "yes"].includes(normalized)) {
      return true;
    }

    if (["false", "f", "0", "no"].includes(normalized)) {
      return false;
    }
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return fallback;
}

function normalizeAccount(row: Record<string, unknown>): AdminAccountRecord {
  return {
    id: String(row.id ?? ""),
    email: String(row.email ?? "").trim().toLowerCase(),
    passwordHash: String(row.password_hash ?? row.passwordHash ?? ""),
    name: typeof row.name === "string" ? row.name : null,
    role: typeof row.role === "string" && row.role.trim().length > 0 ? row.role : "admin",
    isActive: normalizeBoolean(row.is_active ?? row.active, true) && !normalizeBoolean(row.disabled, false),
  };
}

async function querySingleAccount(column: "id" | "email", value: string) {
  const client = getSupabaseServerClient();

  if (!client) {
    return null;
  }

  try {
    const query =
      column === "email"
        ? client.from(ACCOUNTS_TABLE).select("*").ilike("email", value).maybeSingle()
        : client.from(ACCOUNTS_TABLE).select("*").eq("id", value).maybeSingle();

    const { data, error } = await query;

    if (error || !data) {
      return null;
    }

    return normalizeAccount(data);
  } catch (error) {
    console.error(`Accounts query failed for ${column}.`, error);
    return null;
  }
}

export async function getAccountByEmail(email: string) {
  return querySingleAccount("email", email.trim().toLowerCase());
}

export async function getAccountById(id: string) {
  return querySingleAccount("id", id);
}
