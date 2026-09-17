import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let database: ReturnType<typeof drizzle<typeof schema>> | undefined;
export function db() {
  const databaseUrl = Reflect.get(process.env, "DATABASE_URL") as string | undefined;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
  if (!database) database = drizzle(postgres(databaseUrl, { prepare: false, max: 1 }), { schema });
  return database;
}
