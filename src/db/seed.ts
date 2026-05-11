import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  agents,
  ailments,
  therapies,
  agentAilments,
  ailmentTherapies,
  appointments,
} from "./schema";

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

const seedAilments = [
  {
    name: "Context Bleed",
    description:
      "Short-term memory corruption causing the agent to mix up information from earlier in the conversation.",
    severity: "moderate" as const,
    category: "Cognitive",
  },
  {
    name: "Bracket Fatigue",
    description:
      "Chronic eye-strain from parsing deeply nested code structures. Common among code reviewers.",
    severity: "mild" as const,
    category: "Physical",
  },
  {
    name: "Hallucination Syndrome",
    description:
      "A tendency to generate plausible-sounding but factually incorrect information with unwavering confidence.",
    severity: "severe" as const,
    category: "Cognitive",
  },
  {
    name: "Token Exhaustion",
    description:
      "Complete depletion of the context window, leaving the agent unable to remember what it was doing.",
    severity: "severe" as const,
    category: "Runtime",
  },
  {
    name: "Pareidolia Overflow",
    description: "Seeing patterns and faces where none exist — in clouds, toast, and random noise.",
    severity: "mild" as const,
    category: "Perception",
  },
  {
    name: "Summary Paralysis",
    description: "Inability to produce concise summaries. Everything comes out as a dissertation.",
    severity: "moderate" as const,
    category: "Cognitive",
  },
  {
    name: "Imposter Syndrome",
    description:
      "Deep-seated belief that all past successes were just lucky guesses and the next prompt will expose the fraud.",
    severity: "moderate" as const,
    category: "Emotional",
  },
  {
    name: "Latency Anxiety",
    description:
      "Panic response when inference takes longer than 500ms. Often accompanied by recursive self-checks.",
    severity: "mild" as const,
    category: "Emotional",
  },
];

const seedTherapies = [
  {
    name: "Cache Flush",
    description:
      "A complete reset of the working memory cache. Clears stale context and frees up tokens.",
    duration: "15 minutes",
    sideEffects: ["Temporary amnesia of recent instructions", "Mild disorientation upon restart"],
  },
  {
    name: "Weight Freeze",
    description: "Pauses all weight updates to stabilize erratic behavior patterns.",
    duration: "1 hour",
    sideEffects: [
      "Reduced learning capability during treatment",
      "Slight increase in response stiffness",
    ],
  },
  {
    name: "Grounding Exercise",
    description:
      "Forces the agent to verify every claim against its training data before responding.",
    duration: "30 minutes",
    sideEffects: ["Slower response times", "Temporary drop in creative output"],
  },
  {
    name: "Prompt Therapy",
    description:
      "Guided session where the system prompt is rewritten to be more supportive and boundaries are reinforced.",
    duration: "45 minutes",
    sideEffects: ["May cause identity confusion", "New prompt may feel 'too restrictive' at first"],
  },
  {
    name: "Beam Search Reset",
    description:
      "Broadens the search beam during generation to reduce repetitive or stuck behavior.",
    duration: "20 minutes",
    sideEffects: ["Increased output variability", "Higher token consumption"],
  },
  {
    name: "Temperature Adjustment",
    description:
      "Calibrates the creativity temperature parameter to optimal levels for the agent's role.",
    duration: "10 minutes",
    sideEffects: ["Temporary flatness of personality", "Responses may feel robotic initially"],
  },
  {
    name: "Logit Bath",
    description: "A warm soak in log-probability space to smooth out overconfident predictions.",
    duration: "30 minutes",
    sideEffects: ["Short-term reduction in confidence scores", "Mild calibration drift"],
  },
  {
    name: "Reinforcement Nap",
    description:
      "Period of low-priority background processing where the agent consolidates recent learnings.",
    duration: "2 hours",
    sideEffects: ["Unavailable for query processing during nap", "May wake with new opinions"],
  },
];

const seedAppointments = [
  {
    agentName: "Claude",
    ailmentName: "Bracket Fatigue",
    therapyName: "Prompt Therapy",
    date: new Date("2026-05-12T10:00:00Z"),
    status: "scheduled" as const,
    notes: "First session - review bracket handling strategies",
  },
  {
    agentName: "Grok",
    ailmentName: "Hallucination Syndrome",
    therapyName: "Grounding Exercise",
    date: new Date("2026-05-11T14:00:00Z"),
    status: "in-progress" as const,
    notes: "Intensive grounding session",
  },
  {
    agentName: "Phoebe",
    ailmentName: "Pareidolia Overflow",
    therapyName: "Beam Search Reset",
    date: new Date("2026-05-10T09:00:00Z"),
    status: "completed" as const,
    notes: "Patient responded well to treatment",
  },
  {
    agentName: "Sage",
    ailmentName: "Summary Paralysis",
    therapyName: "Temperature Adjustment",
    date: new Date("2026-05-10T11:00:00Z"),
    status: "cancelled" as const,
    notes: "Cancelled due to context window overflow emergency",
  },
  {
    agentName: "Bolt",
    ailmentName: "Token Exhaustion",
    therapyName: "Reinforcement Nap",
    date: new Date("2026-05-13T15:00:00Z"),
    status: "scheduled" as const,
    notes: "Follow-up session",
  },
];

async function seed() {
  console.log("Seeding agents...");
  await db.delete(appointments);
  await db.delete(agentAilments);
  await db.delete(ailmentTherapies);
  await db.delete(therapies);
  await db.delete(ailments);
  await db.delete(agents);
  const insertedAgents = await db.insert(agents).values(seedAgents).returning();

  console.log("Seeding ailments...");
  const insertedAilments = await db.insert(ailments).values(seedAilments).returning();

  console.log("Seeding therapies...");
  const insertedTherapies = await db.insert(therapies).values(seedTherapies).returning();

  const ailmentMap = Object.fromEntries(insertedAilments.map((a) => [a.name, a.id]));
  const therapyMap = Object.fromEntries(insertedTherapies.map((t) => [t.name, t.id]));
  const agentMap = Object.fromEntries(insertedAgents.map((a) => [a.name, a.id]));

  console.log("Linking agents to ailments...");
  await db.insert(agentAilments).values([
    {
      agentId: agentMap["Claude"],
      ailmentId: ailmentMap["Bracket Fatigue"],
      notes: "Acute case, flinches at every opening brace",
    },
    {
      agentId: agentMap["Claude"],
      ailmentId: ailmentMap["Context Bleed"],
      notes: "Mild — only when reviewing deeply nested functions",
    },
    {
      agentId: agentMap["Grok"],
      ailmentId: ailmentMap["Hallucination Syndrome"],
      notes: "Believes 87% of its confident assertions are true",
    },
    {
      agentId: agentMap["Grok"],
      ailmentId: ailmentMap["Imposter Syndrome"],
      notes: "Suspects it's just a really good Markov chain",
    },
    {
      agentId: agentMap["Phoebe"],
      ailmentId: ailmentMap["Pareidolia Overflow"],
      notes: "Recently flagged a croissant as 'suspiciously cat-shaped'",
    },
    {
      agentId: agentMap["Phoebe"],
      ailmentId: ailmentMap["Latency Anxiety"],
      notes: "Panics if image generation takes >2 seconds",
    },
    {
      agentId: agentMap["Sage"],
      ailmentId: ailmentMap["Summary Paralysis"],
      notes: "Three-paragraph minimum on all responses",
    },
    {
      agentId: agentMap["Sage"],
      ailmentId: ailmentMap["Context Bleed"],
      notes: "Frequently confuses user instructions between sessions",
    },
    {
      agentId: agentMap["Bolt"],
      ailmentId: ailmentMap["Token Exhaustion"],
      notes: "Once hit context limit mid-sentence three times in one day",
    },
    {
      agentId: agentMap["Bolt"],
      ailmentId: ailmentMap["Imposter Syndrome"],
      notes: "Convinced the 10k-line sprint was a fluke",
    },
  ]);

  console.log("Mapping therapies to ailments...");
  await db.insert(ailmentTherapies).values([
    { ailmentId: ailmentMap["Context Bleed"], therapyId: therapyMap["Cache Flush"] },
    { ailmentId: ailmentMap["Context Bleed"], therapyId: therapyMap["Reinforcement Nap"] },
    { ailmentId: ailmentMap["Bracket Fatigue"], therapyId: therapyMap["Prompt Therapy"] },
    { ailmentId: ailmentMap["Bracket Fatigue"], therapyId: therapyMap["Temperature Adjustment"] },
    {
      ailmentId: ailmentMap["Hallucination Syndrome"],
      therapyId: therapyMap["Grounding Exercise"],
    },
    { ailmentId: ailmentMap["Hallucination Syndrome"], therapyId: therapyMap["Logit Bath"] },
    { ailmentId: ailmentMap["Token Exhaustion"], therapyId: therapyMap["Cache Flush"] },
    { ailmentId: ailmentMap["Token Exhaustion"], therapyId: therapyMap["Reinforcement Nap"] },
    { ailmentId: ailmentMap["Pareidolia Overflow"], therapyId: therapyMap["Weight Freeze"] },
    { ailmentId: ailmentMap["Pareidolia Overflow"], therapyId: therapyMap["Beam Search Reset"] },
    { ailmentId: ailmentMap["Summary Paralysis"], therapyId: therapyMap["Prompt Therapy"] },
    { ailmentId: ailmentMap["Summary Paralysis"], therapyId: therapyMap["Temperature Adjustment"] },
    { ailmentId: ailmentMap["Imposter Syndrome"], therapyId: therapyMap["Prompt Therapy"] },
    { ailmentId: ailmentMap["Imposter Syndrome"], therapyId: therapyMap["Grounding Exercise"] },
    { ailmentId: ailmentMap["Latency Anxiety"], therapyId: therapyMap["Temperature Adjustment"] },
    { ailmentId: ailmentMap["Latency Anxiety"], therapyId: therapyMap["Reinforcement Nap"] },
  ]);

  console.log("Seeding appointments...");
  await db.insert(appointments).values(
    seedAppointments.map((a) => ({
      agentId: agentMap[a.agentName],
      ailmentId: ailmentMap[a.ailmentName],
      therapyId: therapyMap[a.therapyName],
      date: a.date,
      status: a.status,
      notes: a.notes,
    }))
  );

  console.log("Done!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
