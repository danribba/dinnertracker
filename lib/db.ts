import { createClient } from "@libsql/client";

// Only initialize the client on the server side
const db = typeof window === "undefined" 
  ? createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : null;

if (!db) {
  console.warn("Database client is not available on the client side");
}

export { db };