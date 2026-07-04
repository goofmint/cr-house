# CodeRabbit Schema v2 Reference

Source: https://www.coderabbit.ai/integrations/schema.v2.json

## Table of Contents
1. [Top-Level Fields](#top-level-fields)
2. [reviews](#reviews)
3. [reviews.auto_review](#reviewsauto_review)
4. [reviews.path_instructions](#reviewspath_instructions)
5. [reviews.tools](#reviewstools)
6. [reviews.finishing_touches](#reviewsfinishing_touches)
7. [reviews.pre_merge_checks](#reviewspre_merge_checks)
8. [chat](#chat)
9. [knowledge_base](#knowledge_base)
10. [code_generation](#code_generation)
11. [issue_enrichment](#issue_enrichment)
12. [Validation Rules](#validation-rules)

---

## Top-Level Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `language` | string (ISO code) | `en-US` | Language for review comments. 90+ locales. |
| `tone_instructions` | string (max 250 chars) | — | Custom tone guidance |
| `early_access` | boolean | `false` | Enable experimental features |
| `enable_free_tier` | boolean | `true` | Allow free-tier functionality |
| `inheritance` | boolean | `false` | Enable inheritance from parent configuration |

---

## reviews

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `profile` | `"quiet"` \| `"chill"` \| `"assertive"` | `"chill"` | `quiet` = only the most important feedback; `chill` = balanced; `assertive` = more feedback (may feel nitpicky) |
| `request_changes_workflow` | boolean | `false` | Auto-approve when all comments resolved |
| `abort_on_close` | boolean | `true` | Stop review if PR closes |
| `disable_cache` | boolean | `false` | Disable caching of code and dependencies; fetch fresh on each run |
| `high_level_summary` | boolean | `true` | Generate change summary |
| `high_level_summary_instructions` | string | — | Customize how the high-level summary is generated |
| `high_level_summary_in_walkthrough` | boolean | `false` | Place summary in walkthrough section |
| `high_level_summary_placeholder` | string | `"@coderabbitai summary"` | Placeholder string where the high-level summary will be inserted |
| `auto_title_placeholder` | string | `"@coderabbitai"` | Keyword in the PR title that triggers title auto-generation |
| `auto_title_instructions` | string | — | Customize how PR titles are auto-generated |
| `review_status` | boolean | `true` | Post review status messages in walkthrough |
| `review_details` | boolean | `false` | Post review details (ignored files, extra context, etc.) |
| `commit_status` | boolean | `true` | Set commit status to pending/success during review |
| `collapse_walkthrough` | boolean | `true` | Wrap walkthrough in collapsible section |
| `sequence_diagrams` | boolean | `true` | Generate sequence diagrams |
| `poem` | boolean | `false` | Generate a poem about the changes |
| `in_progress_fortune` | boolean | `true` | Post a fortune message while the review is running |
| `changed_files_summary` | boolean | `true` | Include changed files summary |
| `estimate_code_review_effort` | boolean | `true` | Estimate review effort (1–5) |
| `assess_linked_issues` | boolean | `true` | Evaluate how PR addresses linked issues |
| `related_issues` | boolean | `true` | Surface related open issues |
| `related_prs` | boolean | `true` | Surface related open PRs |
| `suggested_labels` | boolean | `true` | Suggest PR labels |
| `labeling_instructions` | array | `[]` | Define allowed labels and when to suggest them (`label` + `instructions`) |
| `mutually_exclusive_groups` | object | `{}` | Label groups that must not coexist. Example: `{ risk: ['critical', 'high', 'medium', 'low'] }`. Each group needs ≥ 2 labels. |
| `auto_apply_labels` | boolean | `false` | Automatically apply suggested labels |
| `suggested_reviewers` | boolean | `true` | Suggest reviewers |
| `auto_assign_reviewers` | boolean | `false` | Automatically assign suggested reviewers |
| `suggested_reviewers_instructions` | array | `[]` | Map reviewers to PR scenarios. Items: `reviewers` (array of `{handle, type: "user"\|"group"}`) + `instructions` (1–3,000 chars). Team handles are GitHub-only. |
| `path_filters` | string[] | `[]` | Glob patterns; prefix `!` to exclude. Evaluated in order. |
| `fail_commit_status` | boolean | `false` | Set commit status to failure when review finds issues |
| `enable_prompt_for_ai_agents` | boolean | `true` | Include prompt for AI agents in review comments |
| `slop_detection` | object | `{}` | Anti-slop: `enabled` (boolean, default `true`), `label` (string, applied when PR is classified as slop). Public GitHub repos only. |

---

## reviews.auto_review

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable automatic reviews |
| `auto_incremental_review` | boolean | `true` | Re-review on new pushes |
| `auto_pause_after_reviewed_commits` | integer (≥ 0) | `5` | Pause automatic reviews after this many reviewed commits since the last pause. `0` disables pausing. |
| `ignore_title_keywords` | string[] | `[]` | Skip if PR title contains these (e.g. `["WIP"]`) |
| `labels` | string[] | `[]` | Only review if PR has one of these labels |
| `base_branches` | string[] | `[]` | Only review PRs targeting these branches (regex) |
| `ignore_usernames` | string[] | `[]` | Skip PRs from these authors |
| `drafts` | boolean | `false` | Review draft PRs |
| `description_keyword` | string | `""` | If `enabled: false` and this is non-empty, review only when this keyword is present in the PR description |

---

## reviews.path_instructions

Array of per-path review instructions. Each item requires `path` and `instructions` (max 20,000 chars).

```yaml
reviews:
  path_instructions:
    - path: "src/api/**"
      instructions: "..."
```

---

## reviews.tools

Each tool: `enabled: boolean`. **All tools default to `enabled: true`** in the current schema. See `tools-by-language.md` for all YAML keys, per-tool defaults, and config-file requirements.

```yaml
reviews:
  tools:
    eslint:
      enabled: true
```

Some tools accept extra options beyond `enabled`:

| Tool | Extra options |
|------|---------------|
| `ast-grep` | `rule_dirs` (string[]), `util_dirs` (string[]), `essential_rules` (boolean, default `true`), `packages` (string[]) — no `enabled` field |
| `github-checks` | `timeout_ms` (0–900,000, default 90,000) |
| `languagetool` | `enabled_rules`, `disabled_rules`, `enabled_categories`, `disabled_categories` (string[]), `enabled_only` (boolean), `level` (`"default"` \| `"picky"`) |
| `phpstan` | `level` (`"default"`, `"max"`, `"0"`–`"9"`) — requires a config file (`phpstan.neon`) with `paths:` in the repo root |
| `swiftlint`, `golangci-lint`, `detekt`, `pmd`, `semgrep`, `sqlfluff` | `config_file` (string path to the tool's config file in the repo) |
| `fbinfer` | `enable_java` (boolean, default `false`) |

---

## reviews.finishing_touches

One-click agentic actions that polish PRs after review. **Plan requirements:** `docstrings` and `autofix` require Pro or above; `unit_tests`, `simplify`, and `custom` recipes require Pro+ or above.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `docstrings.enabled` | boolean | `true` | Generate docstring suggestions (📝 checkbox / `@coderabbitai generate docstrings`) |
| `unit_tests.enabled` | boolean | `true` | Generate unit test suggestions |
| `simplify.enabled` | boolean | `false` | Code simplification (✨ Simplify code checkbox) — **off by default** |
| `autofix.enabled` | boolean | `true` | Autofix review findings (🪄 checkboxes / `@coderabbitai autofix`) |
| `custom` | array (max 5) | `[]` | Custom recipes. Items: `name` (1–100 chars), `instructions` (1–10,000 chars), `enabled` (boolean, default `true`). Trigger with `@coderabbitai run <recipe name>`. |

```yaml
reviews:
  finishing_touches:
    docstrings:
      enabled: true
    simplify:
      enabled: true
    custom:
      - name: "cleanup stale imports"
        instructions: "Remove unused imports from changed files."
```

---

## reviews.pre_merge_checks

Automated validations before merge. Built-in checks are controlled by `mode` only (there is **no `enabled` field**). **Plan requirement:** Pro+ or above — the setup flow (SKILL.md step 10) only configures `pre_merge_checks` (built-in checks and `custom_checks`) for Pro+ or above.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `override_requested_reviewers_only` | boolean | `false` | Only requested reviewers (not the PR author) can override failing checks |
| `docstrings.mode` | `"off"` \| `"warning"` \| `"error"` | `"warning"` | Docstring coverage check |
| `docstrings.threshold` | number (0–100) | `80` | Minimum docstring coverage (%) required to pass |
| `title.mode` | `"off"` \| `"warning"` \| `"error"` | `"warning"` | PR title check |
| `title.requirements` | string | `""` | Describe title requirements (e.g. "concise, under 50 characters") |
| `description.mode` | `"off"` \| `"warning"` \| `"error"` | `"warning"` | PR description check |
| `issue_assessment.mode` | `"off"` \| `"warning"` \| `"error"` | `"warning"` | Linked issue assessment check |
| `custom_checks` | array (max 50) | `[]` | Custom checks. Items: `name` (1–50 chars), `instructions` (1–10,000 chars, deterministic pass/fail criteria), `mode` (default `"warning"`). |

`mode` semantics: `off` disables the check; `warning` posts a non-blocking warning; `error` requires resolution before merging (blocks the PR when `request_changes_workflow` is enabled).

```yaml
reviews:
  pre_merge_checks:
    docstrings:
      mode: "error"
      threshold: 85
    title:
      mode: "warning"
      requirements: "Start with an imperative verb; keep under 50 characters."
    custom_checks:
      - name: "No TODO comments"
        instructions: "Fail if any TODO comments are found in the diff."
        mode: "warning"
```

---

## chat

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `art` | boolean | `true` | Generate art in chat responses |
| `auto_reply` | boolean | `true` | Reply without `@coderabbitai` mention |
| `allow_non_org_members` | boolean | `true` | Allow non-organization members to interact with CodeRabbit in comment chat (GitHub org repos) |
| `integrations.jira.usage` | `"auto"` \| `"enabled"` \| `"disabled"` | `"auto"` | Jira issue creation (`auto` disables for public repos) |
| `integrations.linear.usage` | `"auto"` \| `"enabled"` \| `"disabled"` | `"auto"` | Linear issue creation (`auto` disables for public repos) |

---

## knowledge_base

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `opt_out` | boolean | `false` | Disable knowledge base features that require data retention (removes stored data) |
| `automatic_repository_linking` | boolean | `false` | Auto-detect and link related org repositories to identify breaking changes and downstream impact |
| `code_guidelines.enabled` | boolean | `true` | Apply organizational coding standards |
| `code_guidelines.filePatterns` | array | — | Guideline file patterns. Items are strings (e.g. `**/AGENTS.md`) or objects `{files, applyTo}` (both required; comma-separated globs). Defaults include `**/.cursorrules`, `.github/copilot-instructions.md`, `**/CLAUDE.md`, `**/GEMINI.md`, `**/.cursor/rules/*`, `**/.windsurfrules`, `**/.clinerules/*`, `**/.rules/*`, `**/AGENT.md`, `**/AGENTS.md`, `**/REVIEW.md`. |
| `learnings.scope` | `"local"` \| `"global"` \| `"auto"` | `"auto"` | Scope of saved learnings |
| `learnings.approval_delay` | integer (0–30) | `0` | Days admins have to approve/reject a learning before it auto-applies. `0` = apply immediately. |
| `issues.scope` | `"local"` \| `"global"` \| `"auto"` | `"auto"` | Issues to include as context |
| `pull_requests.scope` | `"local"` \| `"global"` \| `"auto"` | `"auto"` | PRs to include as context |
| `web_search.enabled` | boolean | `true` | Enable web search for context |
| `mcp.usage` | `"auto"` \| `"enabled"` \| `"disabled"` | `"auto"` | Use MCP servers as a knowledge source (`auto` disables for public repos) |
| `mcp.disabled_servers` | string[] | — | MCP server labels to exclude (case-insensitive) |
| `jira.usage` / `jira.project_keys` | enum / string[] | `"auto"` / `[]` | Jira knowledge source and project keys |
| `linear.usage` / `linear.team_keys` | enum / string[] | `"auto"` / `[]` | Linear knowledge source and team keys |
| `linked_repositories` | array (max 20) | `[]` | External repositories to include as review context |
| `linked_repositories[].repository` | string | — | Repository in `owner/repo` format (GitLab subgroups supported: `group/subgroup/repo`) |
| `linked_repositories[].instructions` | string (max 2,000 chars) | `""` | What the linked repo contains / how to use it as context |

---

## code_generation

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `docstrings.language` | string (ISO locale) | `"en-US"` | Language for generated docstrings (e.g. `ja`, `en-US`) |
| `docstrings.path_instructions` | array | `[]` | Per-path docstring guidelines (`path` + `instructions`, max 20,000 chars) |
| `unit_tests.path_instructions` | array | `[]` | Per-path unit test guidelines (`path` + `instructions`, max 20,000 chars) |

```yaml
code_generation:
  docstrings:
    language: "ja"
    path_instructions:
      - path: "src/**"
        instructions: "..."
  unit_tests:
    path_instructions:
      - path: "src/**"
        instructions: "..."
```

---

## issue_enrichment

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `auto_enrich.enabled` | boolean | `false` | Automatically analyze and enrich issues with context (related code, potential solutions, complexity) |
| `planning.enabled` | boolean | `true` | Generate implementation plans for issues (early preview) |
| `planning.auto_planning.enabled` | boolean | `true` | Trigger issue planning based on labels |
| `planning.auto_planning.labels` | string[] | `[]` | Labels that trigger auto planning. `!label` = negative match. |
| `labeling.labeling_instructions` | array | `[]` | Issue labels to suggest (`label` + `instructions`, max 3,000 chars) |
| `labeling.auto_apply_labels` | boolean | `false` | Auto-apply suggested labels to issues |

---

## Validation Rules

These rules derive from the schema's `additionalProperties: false` constraints and field-level restrictions. Always verify generated YAML against these before writing.

### Structural Constraints

- `additionalProperties: false` is enforced at every level — any key not defined in the schema causes validation failure.
- Only keys documented in this file and `tools-by-language.md` are valid.
- Built-in `pre_merge_checks` (docstrings/title/description/issue_assessment) have **no `enabled` field** — use `mode: "off"` to disable.

### String Length Limits

| Field | Limit |
|-------|-------|
| `tone_instructions` | max 250 characters |
| `reviews.path_instructions[].instructions` | max 20,000 characters |
| `reviews.labeling_instructions[].instructions` | max 3,000 characters |
| `reviews.suggested_reviewers_instructions[].instructions` | 1–3,000 characters |
| `reviews.finishing_touches.custom[].name` | 1–100 characters |
| `reviews.finishing_touches.custom[].instructions` | 1–10,000 characters |
| `reviews.pre_merge_checks.custom_checks[].name` | 1–50 characters |
| `reviews.pre_merge_checks.custom_checks[].instructions` | 1–10,000 characters |
| `knowledge_base.linked_repositories[].instructions` | max 2,000 characters |
| `code_generation.docstrings.path_instructions[].instructions` | max 20,000 characters |
| `code_generation.unit_tests.path_instructions[].instructions` | max 20,000 characters |
| `issue_enrichment.labeling.labeling_instructions[].instructions` | max 3,000 characters |

### Array Size Limits

| Field | Max Items |
|-------|-----------|
| `reviews.finishing_touches.custom` | 5 |
| `reviews.pre_merge_checks.custom_checks` | 50 |
| `knowledge_base.linked_repositories` | 20 |
| `reviews.mutually_exclusive_groups.<group>` | min 2 items |

### Enum Constraints

| Field | Valid Values |
|-------|-------------|
| `language` | ISO locale codes (e.g., `en-US`, `ja`, `zh-CN`, `ko`, `fr`, `de`) |
| `reviews.profile` | `"quiet"` \| `"chill"` \| `"assertive"` |
| `reviews.pre_merge_checks.docstrings.mode`, `.title.mode`, `.description.mode`, `.issue_assessment.mode`, `.custom_checks[].mode` | `"off"` \| `"warning"` \| `"error"` |
| `scope` fields (`learnings.scope`, `issues.scope`, `pull_requests.scope`) | `"local"` \| `"global"` \| `"auto"` |
| `code_generation.docstrings.language` | ISO locale codes (e.g., `en-US`, `ja`) |
| `chat.integrations.jira.usage`, `chat.integrations.linear.usage`, `knowledge_base.mcp.usage`, `knowledge_base.jira.usage`, `knowledge_base.linear.usage` | `"auto"` \| `"enabled"` \| `"disabled"` |
| `reviews.suggested_reviewers_instructions[].reviewers[].type` | `"user"` \| `"group"` |
| `reviews.tools.languagetool.level` | `"default"` \| `"picky"` |
| `reviews.tools.phpstan.level` | `"default"`, `"max"`, `"0"`–`"9"` |

### Numeric Ranges

| Field | Range |
|-------|-------|
| `reviews.pre_merge_checks.docstrings.threshold` | 0–100 (default 80) |
| `knowledge_base.learnings.approval_delay` | 0–30 (integer) |
| `reviews.auto_review.auto_pause_after_reviewed_commits` | ≥ 0 (integer) |
| `reviews.tools.github-checks.timeout_ms` | 0–900,000 (default 90,000) |

### Required Fields

| Array | Required Fields per Item |
|-------|--------------------------|
| `reviews.path_instructions` | `path` and `instructions` |
| `reviews.labeling_instructions` | `label` and `instructions` |
| `reviews.suggested_reviewers_instructions` | `reviewers` (each with `handle`) and `instructions` |
| `reviews.finishing_touches.custom` | `name` and `instructions` (min length 1) |
| `reviews.pre_merge_checks.custom_checks` | `name` and `instructions` (min length 1) |
| `knowledge_base.code_guidelines.filePatterns` (object form) | `files` and `applyTo` |
| `code_generation.docstrings.path_instructions` | `path` and `instructions` |
| `code_generation.unit_tests.path_instructions` | `path` and `instructions` |
| `issue_enrichment.labeling.labeling_instructions` | `label` and `instructions` |
