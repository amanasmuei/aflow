import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export function getGlobalDir(): string {
  return path.join(os.homedir(), ".aflow");
}

export function getFlowPath(): string {
  return path.join(getGlobalDir(), "flow.md");
}

export function flowExists(): boolean {
  return fs.existsSync(getFlowPath());
}

export function ensureGlobalDir(): void {
  const dir = getGlobalDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function acoreExists(): boolean {
  const acoreDir = path.join(os.homedir(), ".acore");
  return fs.existsSync(path.join(acoreDir, "core.md"));
}
