import { describe, it, expect } from "vitest";
import { generateFlowMd, addWorkflow, removeWorkflow } from "../src/lib/writer.js";
import { parseFlowMd } from "../src/lib/parser.js";
import type { Workflow } from "../src/lib/parser.js";

const sampleWorkflow: Workflow = {
  name: "deploy",
  trigger: "When asked to deploy",
  steps: [
    { number: 1, description: "Run tests" },
    { number: 2, description: "Build the project" },
    { number: 3, description: "Deploy to production" },
  ],
};

describe("generateFlowMd", () => {
  it("generates valid flow.md from workflows", () => {
    const result = generateFlowMd([sampleWorkflow]);
    expect(result).toContain("# My Workflows");
    expect(result).toContain("## deploy");
    expect(result).toContain("When asked to deploy:");
    expect(result).toContain("1. Run tests");
    expect(result).toContain("2. Build the project");
    expect(result).toContain("3. Deploy to production");
  });

  it("generates multiple workflows", () => {
    const second: Workflow = {
      name: "test",
      trigger: "When asked to test",
      steps: [{ number: 1, description: "Run vitest" }],
    };
    const result = generateFlowMd([sampleWorkflow, second]);
    expect(result).toContain("## deploy");
    expect(result).toContain("## test");
  });

  it("roundtrips through parser", () => {
    const workflows = [
      sampleWorkflow,
      {
        name: "review",
        trigger: "When asked to review",
        steps: [
          { number: 1, description: "Check code" },
          { number: 2, description: "Leave comments" },
        ],
      },
    ];
    const generated = generateFlowMd(workflows);
    const parsed = parseFlowMd(generated);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe("deploy");
    expect(parsed[0].steps).toHaveLength(3);
    expect(parsed[1].name).toBe("review");
    expect(parsed[1].steps).toHaveLength(2);
  });

  it("returns just header for empty array", () => {
    const result = generateFlowMd([]);
    expect(result.trim()).toBe("# My Workflows");
  });
});

describe("addWorkflow", () => {
  const baseContent = `# My Workflows

## existing
When triggered:
1. Do something
`;

  it("adds a workflow to existing content", () => {
    const result = addWorkflow(baseContent, sampleWorkflow);
    expect(result).toContain("## existing");
    expect(result).toContain("## deploy");
    expect(result).toContain("1. Run tests");
  });

  it("preserves existing workflows", () => {
    const result = addWorkflow(baseContent, sampleWorkflow);
    const parsed = parseFlowMd(result);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe("existing");
    expect(parsed[1].name).toBe("deploy");
  });
});

describe("removeWorkflow", () => {
  const content = `# My Workflows

## first
When first:
1. Step one

## second
When second:
1. Step two

## third
When third:
1. Step three
`;

  it("removes a workflow by name", () => {
    const result = removeWorkflow(content, "second");
    const parsed = parseFlowMd(result);
    expect(parsed).toHaveLength(2);
    expect(parsed.map((w) => w.name)).toEqual(["first", "third"]);
  });

  it("removes the first workflow", () => {
    const result = removeWorkflow(content, "first");
    const parsed = parseFlowMd(result);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe("second");
  });

  it("removes the last workflow", () => {
    const result = removeWorkflow(content, "third");
    const parsed = parseFlowMd(result);
    expect(parsed).toHaveLength(2);
    expect(parsed[1].name).toBe("second");
  });

  it("is case-insensitive", () => {
    const result = removeWorkflow(content, "SECOND");
    const parsed = parseFlowMd(result);
    expect(parsed).toHaveLength(2);
    expect(parsed.map((w) => w.name)).toEqual(["first", "third"]);
  });

  it("handles removing from single-workflow file", () => {
    const single = `# My Workflows

## only
When only:
1. Only step
`;
    const result = removeWorkflow(single, "only");
    expect(result.trim()).toBe("# My Workflows");
  });
});
