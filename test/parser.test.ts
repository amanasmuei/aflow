import { describe, it, expect } from "vitest";
import { parseFlowMd, findWorkflow } from "../src/lib/parser.js";

const SAMPLE_FLOW = `# My Workflows

## code-review
When asked to review code:
1. Analyze for bugs, logic errors, and edge cases
2. Check for security vulnerabilities (OWASP top 10)
3. Evaluate code style and maintainability

## bug-fix
When asked to fix a bug:
1. Reproduce — understand the expected vs actual behavior
2. Locate — find the root cause in the codebase
3. Fix — implement the minimal change that fixes the issue
4. Test — verify the fix works and doesn't break other things

## daily-standup
When starting a new session:
1. Check git log for recent changes
2. Review open PRs and issues
3. Summarize: what was done, what's in progress, what's blocked
4. Ask what to focus on today
`;

describe("parseFlowMd", () => {
  it("parses workflows from flow.md content", () => {
    const workflows = parseFlowMd(SAMPLE_FLOW);
    expect(workflows).toHaveLength(3);
  });

  it("extracts workflow names", () => {
    const workflows = parseFlowMd(SAMPLE_FLOW);
    expect(workflows[0].name).toBe("code-review");
    expect(workflows[1].name).toBe("bug-fix");
    expect(workflows[2].name).toBe("daily-standup");
  });

  it("extracts trigger lines", () => {
    const workflows = parseFlowMd(SAMPLE_FLOW);
    expect(workflows[0].trigger).toBe("When asked to review code");
    expect(workflows[1].trigger).toBe("When asked to fix a bug");
    expect(workflows[2].trigger).toBe("When starting a new session");
  });

  it("extracts steps with numbers", () => {
    const workflows = parseFlowMd(SAMPLE_FLOW);
    expect(workflows[0].steps).toHaveLength(3);
    expect(workflows[0].steps[0]).toEqual({
      number: 1,
      description: "Analyze for bugs, logic errors, and edge cases",
    });
    expect(workflows[0].steps[2]).toEqual({
      number: 3,
      description: "Evaluate code style and maintainability",
    });
  });

  it("handles bug-fix with 4 steps", () => {
    const workflows = parseFlowMd(SAMPLE_FLOW);
    expect(workflows[1].steps).toHaveLength(4);
    expect(workflows[1].steps[3].number).toBe(4);
  });

  it("returns empty array for empty content", () => {
    expect(parseFlowMd("")).toEqual([]);
  });

  it("returns empty array for content with only a title", () => {
    expect(parseFlowMd("# My Workflows\n")).toEqual([]);
  });

  it("handles workflow with no steps", () => {
    const content = `# My Workflows\n\n## empty-flow\nWhen triggered:\n`;
    const workflows = parseFlowMd(content);
    expect(workflows).toHaveLength(1);
    expect(workflows[0].name).toBe("empty-flow");
    expect(workflows[0].steps).toHaveLength(0);
  });

  it("preserves step descriptions with special characters", () => {
    const content = `# Flows\n\n## test\nWhen testing:\n1. Check for bugs — they're sneaky\n2. Run tests (unit + integration)\n`;
    const workflows = parseFlowMd(content);
    expect(workflows[0].steps[0].description).toBe(
      "Check for bugs — they're sneaky",
    );
    expect(workflows[0].steps[1].description).toBe(
      "Run tests (unit + integration)",
    );
  });
});

describe("findWorkflow", () => {
  const workflows = parseFlowMd(SAMPLE_FLOW);

  it("finds a workflow by exact name", () => {
    const result = findWorkflow(workflows, "code-review");
    expect(result).toBeDefined();
    expect(result!.name).toBe("code-review");
  });

  it("finds a workflow case-insensitively", () => {
    const result = findWorkflow(workflows, "Code-Review");
    expect(result).toBeDefined();
    expect(result!.name).toBe("code-review");
  });

  it("returns undefined for unknown workflow", () => {
    expect(findWorkflow(workflows, "nonexistent")).toBeUndefined();
  });

  it("does not match partial names", () => {
    expect(findWorkflow(workflows, "code")).toBeUndefined();
  });
});
