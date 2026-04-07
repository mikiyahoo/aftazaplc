import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Lazy initialization to prevent Prisma client instantiation during build time
// This is critical for Vercel builds where database connections are not available
let _prisma: PrismaClient | null = null;

function getPrismaClient(): PrismaClient {
  if (_prisma) {
    return _prisma;
  }
  
  if (global.prisma) {
    _prisma = global.prisma;
    return _prisma;
  }
  
  _prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
  
  if (process.env.NODE_ENV !== "production") {
    global.prisma = _prisma;
  }
  
  return _prisma;
}

// Export a proxy that lazily initializes Prisma on first use
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    return (client as any)[prop];
  },
});

// Re-export types for convenience
export { PrismaClient } from "@prisma/client";