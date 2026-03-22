import type { Workflow } from "./parser.js";

/**
 * Generate a complete flow.md from structured workflow data.
 */
export function generateFlowMd(workflows: Workflow[]): string {
  const parts = ["# My Workflows"];

  for (const workflow of workflows) {
    parts.push("");
    parts.push(`## ${workflow.name}`);
    parts.push(`${workflow.trigger}:`);
    for (const step of workflow.steps) {
      parts.push(`${step.number}. ${step.description}`);
    }
  }

  return parts.join("\n") + "\n";
}

/**
 * Add a workflow to existing flow.md content.
 * Returns the new content string.
 */
export function addWorkflow(content: string, workflow: Workflow): string {
  const section = formatWorkflow(workflow);

  // Append to end of file
  const trimmed = content.trimEnd();
  return trimmed + "\n\n" + section + "\n";
}

/**
 * Remove a workflow from flow.md content by name.
 * Returns the new content string.
 */
export function removeWorkflow(content: string, name: string): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let skipping = false;
  let lastNonEmptyIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this is the heading for the workflow to remove
    const headingMatch = line.match(/^## (.+)$/);
    if (headingMatch && headingMatch[1].trim().toLowerCase() === name.toLowerCase()) {
      skipping = true;
      // Remove trailing blank lines before this heading
      while (result.length > 0 && result[result.length - 1].trim() === "") {
        result.pop();
      }
      continue;
    }

    // If we hit a new ## heading, stop skipping
    if (skipping && headingMatch) {
      skipping = false;
    }

    if (!skipping) {
      result.push(line);
      if (line.trim() !== "") {
        lastNonEmptyIndex = result.length - 1;
      }
    }
  }

  // Trim trailing blank lines, keep one newline at end
  const trimmed = result.slice(0, lastNonEmptyIndex + 1);
  return trimmed.join("\n") + "\n";
}

function formatWorkflow(workflow: Workflow): string {
  const lines = [`## ${workflow.name}`, `${workflow.trigger}:`];
  for (const step of workflow.steps) {
    lines.push(`${step.number}. ${step.description}`);
  }
  return lines.join("\n");
}
