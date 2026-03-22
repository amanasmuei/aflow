import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getFlowPath, flowExists, ensureGlobalDir } from "../lib/paths.js";

export function initCommand(): void {
  p.intro(pc.bold("aflow") + " — setup");

  if (flowExists()) {
    p.log.warning("flow.md already exists at " + pc.dim(getFlowPath()));
    p.log.info(`Run ${pc.bold("aflow list")} to see your workflows.`);
    p.outro("");
    return;
  }

  ensureGlobalDir();

  // Copy starter template
  const templatePath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "template",
    "flow-starter.md",
  );

  let templateContent: string;
  try {
    templateContent = fs.readFileSync(templatePath, "utf-8");
  } catch {
    // Fallback if template not found (shouldn't happen in normal install)
    templateContent = "# My Workflows\n";
  }

  fs.writeFileSync(getFlowPath(), templateContent, "utf-8");

  p.log.success("Created " + pc.dim(getFlowPath()));
  p.log.info("4 starter workflows included: code-review, bug-fix, feature-build, daily-standup");
  p.log.info(`Run ${pc.bold("aflow list")} to see them.`);
  p.log.info(`Run ${pc.bold("aflow add <name>")} to add your own.`);

  p.outro("Done.");
}
