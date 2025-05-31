// src/db/schemas/links.ts
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
var links = pgTable("links", {
  id: text("id").primaryKey().$defaultFn(() => uuidv7()),
  shortenedUrl: text("shortened_url").notNull().unique(),
  originalUrl: text("original_url").notNull(),
  accessCount: integer("access_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export {
  links
};
