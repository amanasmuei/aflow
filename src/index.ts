import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { listCommand } from "./commands/list.js";
import { showCommand } from "./commands/show.js";
import { addCommand } from "./commands/add.js";
import { removeCommand } from "./commands/remove.js";
import { doctorCommand } from "./commands/doctor.js";
import { flowExists } from "./lib/paths.js";

declare const __VERSION__: string;

const program = new Command();

program
  .name("aflow")
  .description("The portable workflow layer for AI companions")
  .version(__VERSION__)
  .action(() => {
    if (flowExists()) {
      listCommand();
    } else {
      initCommand();
    }
  });

program
  .command("init")
  .description("Create flow.md with starter workflows")
  .action(() => initCommand());

program
  .command("list")
  .description("List defined workflows")
  .action(() => listCommand());

program
  .command("show [name]")
  .description("Show a specific workflow's steps")
  .action((name?: string) => showCommand(name));

program
  .command("add [name]")
  .description("Add a new workflow interactively")
  .action((name?: string) => addCommand(name));

program
  .command("remove <name>")
  .description("Remove a workflow")
  .action((name: string) => removeCommand(name));

program
  .command("doctor")
  .description("Health check your workflow configuration")
  .action(() => doctorCommand());

program.parse();
