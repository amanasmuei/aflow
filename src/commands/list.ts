import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import { getFlowPath, flowExists } from "../lib/paths.js";
import { parseFlowMd } from "../lib/parser.js";

export function listCommand(): void {
  if (!flowExists()) {
    p.intro(pc.bold("aflow") + " — your workflows");
    p.log.info("No flow.md found.");
    p.log.info(`Run ${pc.bold("aflow init")} to create one with starter workflows.`);
    p.outro("");
    return;
  }

  const content = fs.readFileSync(getFlowPath(), "utf-8");
  const workflows = parseFlowMd(content);

  if (workflows.length === 0) {
    p.intro(pc.bold("aflow") + " — your workflows");
    p.log.info("No workflows defined yet.");
    p.log.info(`Run ${pc.bold("aflow add <name>")} to create one.`);
    p.outro("");
    return;
  }

  p.intro(pc.bold("aflow") + " — " + workflows.length + " workflows");

  for (const workflow of workflows) {
    const stepCount = workflow.steps.length;
    p.log.info(
      `${pc.bold(workflow.name)} — ${workflow.trigger} (${stepCount} steps)`,
    );
  }

  p.log.message("");
  p.log.info(`Run ${pc.bold("aflow show <name>")} to see a workflow's steps.`);

  p.outro("");
}
