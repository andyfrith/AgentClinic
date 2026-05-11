CREATE TYPE "public"."staff_role" AS ENUM('admin', 'editor', 'viewer');--> statement-breakpoint
CREATE TABLE "appointment_staff" (
	"appointment_id" integer NOT NULL,
	"staff_id" integer NOT NULL,
	CONSTRAINT "appointment_staff_appointment_id_staff_id_unique" UNIQUE("appointment_id","staff_id")
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" "staff_role" DEFAULT 'viewer' NOT NULL,
	"avatar" varchar(255) DEFAULT '' NOT NULL,
	"specialties" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointment_staff" ADD CONSTRAINT "appointment_staff_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_staff" ADD CONSTRAINT "appointment_staff_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;