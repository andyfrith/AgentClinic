import { describe, it, expect } from "vitest";
import { agents, type Agent, type NewAgent } from "../schema";

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
    const agent: Agent = {
      id: 1,
      name: "Dr. Smith",
      avatar: "",
      specialty: "Cardiology",
      status: "active",
      bio: "A cardiologist.",
    };
    expect(agent.id).toBe(1);
    expect(agent.name).toBe("Dr. Smith");
  });

  it("exports NewAgent type without id", () => {
    const newAgent: NewAgent = {
      name: "Dr. Jones",
      avatar: "",
      specialty: "Neurology",
      status: "active",
      bio: "A neurologist.",
    };
    expect(newAgent.name).toBe("Dr. Jones");
  });
});
