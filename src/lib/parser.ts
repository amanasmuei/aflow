export interface WorkflowStep {
  number: number;
  description: string;
}

export interface Workflow {
  name: string;
  trigger: string;
  steps: WorkflowStep[];
}

/**
 * Parse a flow.md file into structured workflow data.
 */
export function parseFlowMd(content: string): Workflow[] {
  const workflows: Workflow[] = [];
  const lines = content.split("\n");

  let current: Workflow | null = null;

  for (const line of lines) {
    // Match ## workflow-name
    const headingMatch = line.match(/^## (.+)$/);
    if (headingMatch) {
      if (current) {
        workflows.push(current);
      }
      current = {
        name: headingMatch[1].trim(),
        trigger: "",
        steps: [],
      };
      continue;
    }

    if (!current) continue;

    // Match trigger line: "When asked to ..."
    const triggerMatch = line.match(/^(When .+):?\s*$/);
    if (triggerMatch && current.trigger === "" && current.steps.length === 0) {
      current.trigger = triggerMatch[1].replace(/:$/, "").trim();
      continue;
    }

    // Match numbered step: "1. Do something"
    const stepMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (stepMatch) {
      current.steps.push({
        number: parseInt(stepMatch[1], 10),
        description: stepMatch[2].trim(),
      });
      continue;
    }
  }

  // Push the last workflow
  if (current) {
    workflows.push(current);
  }

  return workflows;
}

/**
 * Find a workflow by name (case-insensitive).
 */
export function findWorkflow(
  workflows: Workflow[],
  name: string,
): Workflow | undefined {
  return workflows.find((w) => w.name.toLowerCase() === name.toLowerCase());
}
