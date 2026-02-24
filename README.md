# cr-house

Custom Claude Code skills for [CodeRabbit](https://coderabbit.ai).

## Skills

### coderabbit-config

Interactively generates or updates `.coderabbit.yaml` for your project.

- Analyzes project structure (monorepo modules, DB paths, API specs, test dirs, etc.)
- Asks focused questions about review priorities per area
- Generates `path_instructions` based on your answers
- Never writes fields that match CodeRabbit defaults

#### Installation

**User-level** (available in all projects):

```bash
cp -r skills/coderabbit-config ~/.claude/skills/
```

**Project-level** (current project only):

```bash
mkdir -p .claude/skills
cp -r skills/coderabbit-config .claude/skills/
```

Restart Claude Code after copying.

#### Usage

In a Claude Code session, ask Claude to create or update `.coderabbit.yaml`. Claude will analyze the project, ask you questions, and write the config after confirmation.

#### Packaging for claude.ai distribution

```bash
python3 ~/.claude/plugins/cache/anthropic-agent-skills/example-skills/1ed29a03dc85/skills/skill-creator/scripts/package_skill.py \
  skills/coderabbit-config \
  skills/
```

## License

MIT © 2026 Atsushi Nakatsugawa
