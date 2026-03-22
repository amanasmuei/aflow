import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import { getFlowPath, flowExists } from "../lib/paths.js";
import { parseFlowMd, findWorkflow } from "../lib/parser.js";
import { removeWorkflow } from "../lib/writer.js";

export function removeCommand(name: string): void {
  p.intro(pc.bold("aflow") + " — removing " + pc.cyan(name));

  if (!flowExists()) {
    p.log.error("No flow.md found.");
    p.log.info(`Run ${pc.bold("aflow init")} first.`);
    p.outro("");
    return;
  }

  const content = fs.readFileSync(getFlowPath(), "utf-8");
  const workflows = parseFlowMd(content);

  if (!findWorkflow(workflows, name)) {
    p.log.error(`Workflow "${name}" not found.`);
    p.log.info(`Run ${pc.bold("aflow list")} to see available workflows.`);
    p.outro("");
    return;
  }

  const newContent = removeWorkflow(content, name);
  fs.writeFileSync(getFlowPath(), newContent, "utf-8");

  p.log.success(`Removed ${pc.bold(name)}`);
  p.log.success("Updated " + pc.dim(getFlowPath()));
  p.outro("Done.");
}
