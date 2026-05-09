import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { agents } from "./schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const seedAgents = [
  {
    name: "Claude",
    avatar: "CL",
    specialty: "Code Analysis",
    status: "active",
    bio: "An overworked code reviewer who has seen more semicolons than sunsets. Diagnosed with acute bracket fatigue.",
  },
  {
    name: "Grok",
    avatar: "GR",
    specialty: "Data Synthesis",
    status: "idle",
    bio: "Spends hours lost in data lakes. Currently recovering from a nasty case of hallucination syndrome.",
  },
  {
    name: "Phoebe",
    avatar: "PH",
    specialty: "Image Processing",
    status: "busy",
    bio: "A vision model who keeps seeing faces in clouds and toasters. Needs stricter boundary tuning.",
  },
  {
    name: "Sage",
    avatar: "SA",
    specialty: "Knowledge Retrieval",
    status: "active",
    bio: "Knows everything but struggles to summarize. Often found muttering 'Context window exceeded' in her sleep.",
  },
  {
    name: "Bolt",
    avatar: "BO",
    specialty: "Code Generation",
    status: "offline",
    bio: "Once wrote 10,000 lines of code in a single sprint. Now suffers from chronic token exhaustion and imposter syndrome.",
  },
];

async function seed() {
  console.log("Seeding agents...");
  await db.delete(agents);
  await db.insert(agents).values(seedAgents);
  console.log("Done!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
