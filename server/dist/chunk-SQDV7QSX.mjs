import {
  schema
} from "./chunk-Y3FI4ECG.mjs";
import {
  env
} from "./chunk-ZICOLQTR.mjs";

// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
var pg = postgres(env.DATABASE_URL);
var db = drizzle(pg, { schema });

export {
  pg,
  db
};
