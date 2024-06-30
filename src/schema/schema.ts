import {
  integer,
  serial,
  varchar,
  timestamp,
  pgTable,
} from "drizzle-orm/pg-core";
//https://orm.drizzle.team/docs/sql-schema-declaration
export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 64 }).unique().notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const apikey = pgTable("apikey", {
  id: serial("id").primaryKey(),
  key: varchar("key"),
  user: integer("user_id").references(() => user.id),
});

export type User = typeof user.$inferSelect;
export type ApiKey = typeof apikey.$inferSelect;
export type NewUser = typeof user.$inferInsert;