import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import { getFlowPath, flowExists } from "../lib/paths.js";
import { parseFlowMd, findWorkflow } from "../lib/parser.js";

export function showCommand(name?: string): void {
  if (!flowExists()) {
    p.intro(pc.bold("aflow show"));
    p.log.info("No flow.md found.");
    p.log.info(`Run ${pc.bold("aflow init")} to create one.`);
    p.outro("");
    return;
  }

  const content = fs.readFileSync(getFlowPath(), "utf-8");

  // If no name given, show the full file
  if (!name) {
    p.intro(pc.bold("aflow") + " — flow.md");
    console.log(content);
    p.outro("");
    return;
  }

  const workflows = parseFlowMd(content);
  const workflow = findWorkflow(workflows, name);

  if (!workflow) {
    p.intro(pc.bold("aflow show"));
    p.log.error(`Workflow "${name}" not found.`);
    p.log.info(`Run ${pc.bold("aflow list")} to see available workflows.`);
    p.outro("");
    return;
  }

  p.intro(pc.bold("aflow") + " — " + pc.cyan(workflow.name));
  p.log.info(pc.dim(workflow.trigger));
  p.log.message("");

  for (const step of workflow.steps) {
    p.log.info(`${pc.bold(String(step.number))}. ${step.description}`);
  }

  p.outro("");
}
