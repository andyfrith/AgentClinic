CREATE TYPE "public"."appointment_status" AS ENUM('scheduled', 'in-progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('mild', 'moderate', 'severe');--> statement-breakpoint
CREATE TABLE "agent_ailments" (
	"agent_id" integer NOT NULL,
	"ailment_id" integer NOT NULL,
	"diagnosed_at" timestamp DEFAULT now() NOT NULL,
	"notes" text DEFAULT '',
	CONSTRAINT "agent_ailments_agent_id_ailment_id_unique" UNIQUE("agent_id","ailment_id")
);
--> statement-breakpoint
CREATE TABLE "agents" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"avatar" varchar(255) DEFAULT '' NOT NULL,
	"specialty" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"bio" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ailment_therapies" (
	"ailment_id" integer NOT NULL,
	"therapy_id" integer NOT NULL,
	CONSTRAINT "ailment_therapies_ailment_id_therapy_id_unique" UNIQUE("ailment_id","therapy_id")
);
--> statement-breakpoint
CREATE TABLE "ailments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"severity" "severity" DEFAULT 'mild' NOT NULL,
	"category" varchar(100) DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"agent_id" integer NOT NULL,
	"ailment_id" integer NOT NULL,
	"therapy_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"status" "appointment_status" DEFAULT 'scheduled' NOT NULL,
	"notes" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "therapies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"duration" varchar(100) DEFAULT '' NOT NULL,
	"side_effects" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agent_ailments" ADD CONSTRAINT "agent_ailments_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_ailments" ADD CONSTRAINT "agent_ailments_ailment_id_ailments_id_fk" FOREIGN KEY ("ailment_id") REFERENCES "public"."ailments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ailment_therapies" ADD CONSTRAINT "ailment_therapies_ailment_id_ailments_id_fk" FOREIGN KEY ("ailment_id") REFERENCES "public"."ailments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ailment_therapies" ADD CONSTRAINT "ailment_therapies_therapy_id_therapies_id_fk" FOREIGN KEY ("therapy_id") REFERENCES "public"."therapies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_ailment_id_ailments_id_fk" FOREIGN KEY ("ailment_id") REFERENCES "public"."ailments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_therapy_id_therapies_id_fk" FOREIGN KEY ("therapy_id") REFERENCES "public"."therapies"("id") ON DELETE cascade ON UPDATE no action;