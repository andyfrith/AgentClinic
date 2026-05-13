import {
  pgTable,
  pgEnum,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 255 }).notNull().default(""),
  specialty: varchar("specialty", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  bio: text("bio").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const severityEnum = pgEnum("severity", ["mild", "moderate", "severe"]);

export const ailments = pgTable("ailments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull().default(""),
  severity: severityEnum("severity").notNull().default("mild"),
  category: varchar("category", { length: 100 }).notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const therapies = pgTable("therapies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull().default(""),
  duration: varchar("duration", { length: 100 }).notNull().default(""),
  sideEffects: text("side_effects").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const agentAilments = pgTable(
  "agent_ailments",
  {
    agentId: integer("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),
    ailmentId: integer("ailment_id")
      .notNull()
      .references(() => ailments.id, { onDelete: "cascade" }),
    diagnosedAt: timestamp("diagnosed_at").defaultNow().notNull(),
    notes: text("notes").default(""),
  },
  (t) => [unique().on(t.agentId, t.ailmentId)]
);

export const ailmentTherapies = pgTable(
  "ailment_therapies",
  {
    ailmentId: integer("ailment_id")
      .notNull()
      .references(() => ailments.id, { onDelete: "cascade" }),
    therapyId: integer("therapy_id")
      .notNull()
      .references(() => therapies.id, { onDelete: "cascade" }),
  },
  (t) => [unique().on(t.ailmentId, t.therapyId)]
);

export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;
export type Ailment = typeof ailments.$inferSelect;
export type NewAilment = typeof ailments.$inferInsert;
export type Therapy = typeof therapies.$inferSelect;
export type NewTherapy = typeof therapies.$inferInsert;
export type AgentAilment = typeof agentAilments.$inferSelect;
export type NewAgentAilment = typeof agentAilments.$inferInsert;
export type AilmentTherapy = typeof ailmentTherapies.$inferSelect;
export type NewAilmentTherapy = typeof ailmentTherapies.$inferInsert;

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "scheduled",
  "in-progress",
  "completed",
  "cancelled",
]);

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id")
    .notNull()
    .references(() => agents.id, { onDelete: "cascade" }),
  ailmentId: integer("ailment_id")
    .notNull()
    .references(() => ailments.id, { onDelete: "cascade" }),
  therapyId: integer("therapy_id")
    .notNull()
    .references(() => therapies.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  status: appointmentStatusEnum("status").notNull().default("scheduled"),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;

export const staffRoleEnum = pgEnum("staff_role", ["admin", "editor", "viewer"]);

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: staffRoleEnum("role").notNull().default("viewer"),
  avatar: varchar("avatar", { length: 255 }).notNull().default(""),
  specialties: text("specialties").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const appointmentStaff = pgTable(
  "appointment_staff",
  {
    appointmentId: integer("appointment_id")
      .notNull()
      .references(() => appointments.id, { onDelete: "cascade" }),
    staffId: integer("staff_id")
      .notNull()
      .references(() => staff.id, { onDelete: "cascade" }),
  },
  (t) => [unique().on(t.appointmentId, t.staffId)]
);

export type Staff = typeof staff.$inferSelect;
export type NewStaff = typeof staff.$inferInsert;
export type AppointmentStaff = typeof appointmentStaff.$inferSelect;
export type NewAppointmentStaff = typeof appointmentStaff.$inferInsert;
