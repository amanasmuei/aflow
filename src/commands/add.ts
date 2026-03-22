import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import { getFlowPath, flowExists } from "../lib/paths.js";
import { parseFlowMd, findWorkflow } from "../lib/parser.js";
import { addWorkflow } from "../lib/writer.js";
import type { WorkflowStep } from "../lib/parser.js";

export async function addCommand(name?: string): Promise<void> {
  p.intro(pc.bold("aflow") + " — add workflow");

  if (!flowExists()) {
    p.log.error("No flow.md found.");
    p.log.info(`Run ${pc.bold("aflow init")} first.`);
    p.outro("");
    return;
  }

  const content = fs.readFileSync(getFlowPath(), "utf-8");
  const workflows = parseFlowMd(content);

  // Get workflow name
  let workflowName: string;
  if (name) {
    workflowName = name;
  } else {
    const nameResult = await p.text({
      message: "Workflow name?",
      placeholder: "e.g., deploy",
      validate: (value) => {
        if (!value.trim()) return "Name is required.";
        return undefined;
      },
    });
    if (p.isCancel(nameResult)) {
      p.outro("Cancelled.");
      return;
    }
    workflowName = nameResult as string;
  }

  // Check for duplicates
  if (findWorkflow(workflows, workflowName)) {
    p.log.error(`Workflow "${workflowName}" already exists.`);
    p.log.info(`Run ${pc.bold("aflow remove " + workflowName)} first to replace it.`);
    p.outro("");
    return;
  }

  // Get trigger
  const triggerResult = await p.text({
    message: "When should this run?",
    placeholder: "e.g., When asked to deploy",
    validate: (value) => {
      if (!value.trim()) return "Trigger is required.";
      return undefined;
    },
  });
  if (p.isCancel(triggerResult)) {
    p.outro("Cancelled.");
    return;
  }
  const trigger = triggerResult as string;

  // Get steps
  p.log.info("Add steps one at a time (empty to finish):");
  const steps: WorkflowStep[] = [];
  let stepNum = 1;

  while (true) {
    const stepResult = await p.text({
      message: `Step ${stepNum}:`,
      placeholder: stepNum === 1 ? "e.g., Run tests" : "Leave empty to finish",
    });
    if (p.isCancel(stepResult)) {
      p.outro("Cancelled.");
      return;
    }
    const stepText = (stepResult as string).trim();
    if (!stepText) break;

    steps.push({ number: stepNum, description: stepText });
    stepNum++;
  }

  if (steps.length === 0) {
    p.log.error("At least one step is required.");
    p.outro("");
    return;
  }

  // Write to flow.md
  const newContent = addWorkflow(content, {
    name: workflowName,
    trigger,
    steps,
  });
  fs.writeFileSync(getFlowPath(), newContent, "utf-8");

  p.log.success(
    `Added ${pc.bold(workflowName)} with ${steps.length} steps`,
  );
  p.outro("Done.");
}
