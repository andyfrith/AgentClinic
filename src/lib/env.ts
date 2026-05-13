import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1, "DATABASE_URL is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Environment variable validation failed:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
