import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 255 }).notNull().default(""),
  specialty: varchar("specialty", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  bio: text("bio").notNull().default(""),
});

export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;
