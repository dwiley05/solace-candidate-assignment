import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __drizzleDb__: PostgresJsDatabase | undefined;
}

const setup = () => {
  if (global.__drizzleDb__) {
    return global.__drizzleDb__;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const queryClient = postgres(process.env.DATABASE_URL);
  const db = drizzle(queryClient);
  global.__drizzleDb__ = db;
  return db;
};

export default setup();
