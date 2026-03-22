<div align="center">

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/aflow-workflow_layer-white?style=for-the-badge&labelColor=0d1117&color=58a6ff">
  <img alt="aflow" src="https://img.shields.io/badge/aflow-workflow_layer-black?style=for-the-badge&labelColor=f6f8fa&color=24292f">
</picture>

### The portable workflow layer for AI companions.

Define multi-step AI workflows in a single file. Your AI reads it and follows the steps.

<br>

[![npm](https://img.shields.io/npm/v/@aman_asmuei/aflow?style=flat-square&color=cb3837)](https://www.npmjs.com/package/@aman_asmuei/aflow)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![acore](https://img.shields.io/badge/part_of-acore_ecosystem-58a6ff.svg?style=flat-square)](https://github.com/amanasmuei/acore)

</div>

---

## The Problem

Every AI session starts from scratch. You explain the same process every time: "when reviewing code, check for X, Y, Z" or "when fixing a bug, follow these steps." Your AI has no memory of your preferred workflows.

## The Solution

**aflow** lets you define reusable workflows in a `flow.md` file. Your AI reads this file and follows multi-step processes consistently.

```bash
npx @aman_asmuei/aflow init
```

This creates `~/.aflow/flow.md` with 4 starter workflows. Add it to your AI's system prompt and it follows your workflows automatically.

---

## The Ecosystem

```
aman
├── acore     →  identity   (who it IS)
├── amem      →  memory     (what it KNOWS)
├── akit      →  tools      (what it CAN DO)
└── aflow     →  workflows  (HOW it works)
```

| Layer | Package | What it does |
|:------|:--------|:-------------|
| Identity | [acore](https://github.com/amanasmuei/acore) | Personality, values, relationship memory |
| Memory | [amem](https://github.com/amanasmuei/amem) | Automated knowledge storage |
| Tools | [akit](https://github.com/amanasmuei/akit) | Portable AI capabilities |
| Workflows | **aflow** | Multi-step AI workflows |

Each works independently. Together they're a complete portable AI agent.

---

## Quick Start

```bash
# Create flow.md with starter workflows
npx @aman_asmuei/aflow init

# List your workflows
npx @aman_asmuei/aflow list

# See a specific workflow
npx @aman_asmuei/aflow show code-review

# Add a custom workflow
npx @aman_asmuei/aflow add deploy

# Remove a workflow
npx @aman_asmuei/aflow remove daily-standup

# Health check
npx @aman_asmuei/aflow doctor
```

## Commands

| Command | What it does |
|:--------|:------------|
| `aflow` | First run: create flow.md. After: show workflows |
| `aflow init` | Create `~/.aflow/flow.md` with starter workflows |
| `aflow list` | List defined workflows |
| `aflow show <name>` | Show a specific workflow's steps |
| `aflow add [name]` | Add a new workflow interactively |
| `aflow remove <name>` | Remove a workflow |
| `aflow doctor` | Health check |

## How It Works

### flow.md — The Workflow Definition

Every workflow lives in `~/.aflow/flow.md`:

```markdown
# My Workflows

## code-review
When asked to review code:
1. Analyze for bugs, logic errors, and edge cases
2. Check for security vulnerabilities (OWASP top 10)
3. Evaluate code style and maintainability
4. Summarize findings with severity ratings (critical/warning/info)
5. Suggest specific fixes with code examples

## bug-fix
When asked to fix a bug:
1. Reproduce — understand the expected vs actual behavior
2. Locate — find the root cause in the codebase
3. Fix — implement the minimal change that fixes the issue
4. Test — verify the fix works and doesn't break other things
5. Document — explain what was wrong and why the fix works
```

Your AI reads this file and automatically follows the defined steps when the trigger matches.

### Platform Behavior

| Platform | What happens |
|:---------|:------------|
| Claude Code / Cursor | AI reads flow.md, executes steps automatically with tools |
| ChatGPT / Gemini / Other | AI reads flow.md, guides you through each step manually |

### Integration with acore

If you use [acore](https://github.com/amanasmuei/acore), run `acore pull --sync-only` to refresh your platform files and pick up flow.md.

---

## Starter Workflows

The `aflow init` command includes 4 workflows to get started:

| Workflow | Trigger | Steps |
|:---------|:--------|:------|
| `code-review` | When asked to review code | 5 steps: bugs, security, style, summary, fixes |
| `bug-fix` | When asked to fix a bug | 5 steps: reproduce, locate, fix, test, document |
| `feature-build` | When asked to build a feature | 5 steps: clarify, design, implement, test, review |
| `daily-standup` | When starting a new session | 4 steps: git log, PRs, summary, focus |

## Privacy

All data stays local. `~/.aflow/` contains your workflow definitions. No telemetry. No accounts. No cloud.

## Contributing

Contributions welcome! Add starter workflows, improve the parser, or suggest features.

## License

[MIT](LICENSE)

---

<div align="center">

**Define once. Follow always. Every AI.**

</div>
