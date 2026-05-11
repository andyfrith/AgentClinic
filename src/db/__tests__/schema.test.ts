import { describe, it, expect } from "vitest";
import {
  agents,
  ailments,
  therapies,
  agentAilments,
  ailmentTherapies,
  type Agent,
  type NewAgent,
  type Ailment,
  type NewAilment,
  type Therapy,
  type NewTherapy,
  type AgentAilment,
  type AilmentTherapy,
} from "../schema";

describe("agents schema", () => {
  it("defines all expected columns directly on the table", () => {
    expect(agents.id).toBeDefined();
    expect(agents.name).toBeDefined();
    expect(agents.avatar).toBeDefined();
    expect(agents.specialty).toBeDefined();
    expect(agents.status).toBeDefined();
    expect(agents.bio).toBeDefined();
  });

  it("has id as a serial primary key", () => {
    expect(agents.id.primary).toBe(true);
    expect(agents.id.notNull).toBe(true);
    expect(agents.id.dataType).toBe("number");
  });

  it("has name as a required varchar(255)", () => {
    expect(agents.name.notNull).toBe(true);
    expect(agents.name.dataType).toBe("string");
  });

  it("has avatar with a default empty string", () => {
    expect(agents.avatar.default).toBe("");
    expect(agents.avatar.notNull).toBe(true);
  });

  it("has status with a default of 'active'", () => {
    expect(agents.status.default).toBe("active");
  });

  it("has bio with a default empty string", () => {
    expect(agents.bio.default).toBe("");
    expect(agents.bio.notNull).toBe(true);
  });

  it("exports Agent type matching the schema shape", () => {
    const agent: Agent = { id: 1, name: "Dr. Smith", avatar: "", specialty: "Cardiology", status: "active", bio: "A cardiologist." };
    expect(agent.id).toBe(1);
    expect(agent.name).toBe("Dr. Smith");
  });

  it("exports NewAgent type without id", () => {
    const newAgent: NewAgent = { name: "Dr. Jones", avatar: "", specialty: "Neurology", status: "active", bio: "A neurologist." };
    expect(newAgent.name).toBe("Dr. Jones");
  });
});

describe("ailments schema", () => {
  it("defines all expected columns", () => {
    expect(ailments.id).toBeDefined();
    expect(ailments.name).toBeDefined();
    expect(ailments.description).toBeDefined();
    expect(ailments.severity).toBeDefined();
    expect(ailments.category).toBeDefined();
    expect(ailments.createdAt).toBeDefined();
    expect(ailments.updatedAt).toBeDefined();
  });

  it("has severity with a default of 'mild'", () => {
    expect(ailments.severity.default).toBe("mild");
  });

  it("has name as required varchar", () => {
    expect(ailments.name.notNull).toBe(true);
  });

  it("exports Ailment type", () => {
    const a: Ailment = { id: 1, name: "Test", description: "", severity: "mild", category: "", createdAt: new Date(), updatedAt: new Date() };
    expect(a.name).toBe("Test");
  });

  it("exports NewAilment type without id", () => {
    const n: NewAilment = { name: "Test", description: "", severity: "mild", category: "" };
    expect(n.name).toBe("Test");
  });
});

describe("therapies schema", () => {
  it("defines all expected columns", () => {
    expect(therapies.id).toBeDefined();
    expect(therapies.name).toBeDefined();
    expect(therapies.description).toBeDefined();
    expect(therapies.duration).toBeDefined();
    expect(therapies.sideEffects).toBeDefined();
    expect(therapies.createdAt).toBeDefined();
    expect(therapies.updatedAt).toBeDefined();
  });

  it("has sideEffects as an array", () => {
    expect(therapies.sideEffects.dataType).toBe("array");
  });

  it("exports Therapy type", () => {
    const t: Therapy = { id: 1, name: "Test", description: "", duration: "", sideEffects: [], createdAt: new Date(), updatedAt: new Date() };
    expect(t.name).toBe("Test");
  });

  it("exports NewTherapy type without id", () => {
    const n: NewTherapy = { name: "Test", description: "", duration: "", sideEffects: [] };
    expect(n.name).toBe("Test");
  });
});

describe("agent_ailments join table", () => {
  it("defines agentId, ailmentId, diagnosedAt, notes", () => {
    expect(agentAilments.agentId).toBeDefined();
    expect(agentAilments.ailmentId).toBeDefined();
    expect(agentAilments.diagnosedAt).toBeDefined();
    expect(agentAilments.notes).toBeDefined();
  });

  it("exports AgentAilment type", () => {
    const aa: AgentAilment = { agentId: 1, ailmentId: 2, diagnosedAt: new Date(), notes: "" };
    expect(aa.agentId).toBe(1);
    expect(aa.ailmentId).toBe(2);
  });
});

describe("ailment_therapies join table", () => {
  it("defines ailmentId and therapyId", () => {
    expect(ailmentTherapies.ailmentId).toBeDefined();
    expect(ailmentTherapies.therapyId).toBeDefined();
  });

  it("exports AilmentTherapy type", () => {
    const at: AilmentTherapy = { ailmentId: 1, therapyId: 2 };
    expect(at.ailmentId).toBe(1);
    expect(at.therapyId).toBe(2);
  });
});
