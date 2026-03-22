import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { getFlowPath, flowExists, acoreExists } from "../lib/paths.js";
import { parseFlowMd } from "../lib/parser.js";

export function doctorCommand(): void {
  p.intro(pc.bold("aflow doctor") + " — health check");

  let score = 10;

  // Check: flow.md exists
  if (flowExists()) {
    p.log.success("flow.md exists");
  } else {
    p.log.error(
      "flow.md not found — run " + pc.bold("aflow init") + " to create it",
    );
    score -= 3;
  }

  // Check: flow.md is parseable and has workflows
  if (flowExists()) {
    try {
      const content = fs.readFileSync(getFlowPath(), "utf-8");
      const workflows = parseFlowMd(content);

      if (workflows.length === 0) {
        p.log.warning("No workflows defined — run " + pc.bold("aflow add <name>"));
        score -= 2;
      } else {
        p.log.success(`${workflows.length} workflows defined`);

        // Check for workflows with no steps
        const empty = workflows.filter((w) => w.steps.length === 0);
        if (empty.length > 0) {
          p.log.warning(
            `${empty.length} workflow(s) have no steps: ${empty.map((w) => w.name).join(", ")}`,
          );
          score -= 1;
        }

        // Check for workflows with no trigger
        const noTrigger = workflows.filter((w) => !w.trigger);
        if (noTrigger.length > 0) {
          p.log.warning(
            `${noTrigger.length} workflow(s) have no trigger: ${noTrigger.map((w) => w.name).join(", ")}`,
          );
          score -= 1;
        }
      }
    } catch {
      p.log.error("flow.md could not be parsed");
      score -= 2;
    }
  }

  // Check: acore integration
  if (acoreExists()) {
    p.log.success("acore detected — identity layer connected");
  } else {
    p.log.info(
      "acore not found — run " +
        pc.bold("npx @aman_asmuei/acore") +
        " for AI identity",
    );
  }

  // Check: amem integration
  const amemDir = path.join(os.homedir(), ".amem");
  if (fs.existsSync(amemDir)) {
    p.log.success("amem detected — memory layer connected");
  } else {
    p.log.info(
      "amem not found — run " +
        pc.bold("npx @aman_asmuei/amem") +
        " for AI memory",
    );
  }

  // Check: akit integration
  const akitDir = path.join(os.homedir(), ".akit");
  if (fs.existsSync(akitDir)) {
    p.log.success("akit detected — tools layer connected");
  } else {
    p.log.info(
      "akit not found — run " +
        pc.bold("npx @aman_asmuei/akit") +
        " for AI tools",
    );
  }

  // Score
  score = Math.max(0, score);
  const scoreColor = score >= 8 ? pc.green : score >= 5 ? pc.yellow : pc.red;
  p.log.message("");
  p.log.info(`Score: ${scoreColor(`${score}/10`)}`);

  p.outro("");
}
