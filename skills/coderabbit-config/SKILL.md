---
name: coderabbit-config
description: Generate or update a .coderabbit.yaml configuration file for CodeRabbit AI code review. Use when the user wants to set up CodeRabbit, configure .coderabbit.yaml, adjust review settings, configure ignored paths, set up path-specific review instructions, change review tone or language, or customize CodeRabbit behavior in any way. Triggers on phrases like "coderabbit setup", "configure coderabbit", "create .coderabbit.yaml", "update coderabbit config", or any mention of .coderabbit.yaml.
---

# CodeRabbit Config

Generate or update `.coderabbit.yaml` following the CodeRabbit schema v2.
Schema field reference: `references/schema.md`. Tool YAML keys: `references/tools-by-language.md`.

## What to do first (before generating any YAML)

**Execute the following steps in order. Do not write or show any YAML until all questions are answered.**

### 1. Load existing config + analyze project structure

Use Glob/Bash to check all of the following and record findings:

- Does `.coderabbit.yaml` exist? (if yes, read it — see step 1a)
- Is it a monorepo? (top-level dirs: `api/`, `backend/`, `frontend/`, `app/`, `web/`, `mobile/`, `ios/`, `android/`, `packages/`, `services/`, `apps/`)
- Workspace markers: `pnpm-workspace.yaml`, `nx.json`, `lerna.json`, `turbo.json`
- Per module/root, detect language: Go (`go.mod`), TypeScript (`package.json`+`tsconfig.json`), Rails (`Gemfile`+`app/` or `db/migrate/`), Python (`pyproject.toml`), Rust (`Cargo.toml`), PHP (`composer.json`)
- DB paths: `db/migrate/`, `*/db/migrate/`, `prisma/migrations/`, `**/migrations/`, `**/*.sql`
- API specs: `**/openapi.yaml`, `**/swagger.yaml`, `**/openapi.json`, `**/swagger.json`, `api-docs/`, `docs/api/`
- Markdown: any `.md` files beyond `README.md`
- Test dirs: `spec/`, `test/`, `tests/`, `__tests__/`, `**/*.test.*`, `**/*.spec.*`
- Build/vendor/lock-file paths: `dist/`, `build/`, `node_modules/`, `vendor/`, `.venv/`, `.next/`, `target/`, `__pycache__/`, `coverage/`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `Cargo.lock`, `poetry.lock`, `Gemfile.lock`
- **Linter/SAST config files** for the tools relevant to the detected languages (see the "Config file" columns in `references/tools-by-language.md`): e.g. `eslint.config.*`/`.eslintrc*`, `biome.json`, `ruff.toml`/`pyproject.toml`, `.rubocop.yml`, `phpstan.neon*`, `.golangci.*`, `detekt.yml`, `.swiftlint.yml`, `.stylelintrc*`, `.sqlfluff`, `.markdownlint*`, `.yamllint*`, `.tflint.hcl`, `.checkov.yaml`, `.hadolint.yaml`, `semgrep.yml`, `sgconfig.yml`, `.gitleaks.toml`

Present findings to the user before asking any questions.

#### 1a. Update mode (existing `.coderabbit.yaml`)

If `.coderabbit.yaml` already exists, run a **drift analysis** before asking anything:

1. **Schema drift** — validate every key in the existing file against `references/schema.md` / `references/tools-by-language.md`. Flag keys that no longer exist in the current schema, invalid enum values, and fields whose schema default has changed since the file was written (e.g. `poem` is now `false` by default, built-in `pre_merge_checks` no longer have an `enabled` field — use `mode` instead).
2. **Structure drift** — compare the existing `path_instructions` / `path_filters` globs against the current project structure from step 1. Flag entries pointing at directories that no longer exist, modules that were renamed/moved, and newly added modules that have no coverage. Flag `reviews.tools` entries for languages that are no longer present.
3. Present the drift report and call AskUserQuestion for each category: migrate (rewrite to match the current structure/schema), keep as-is, or remove.
4. **Preserve all still-valid user customizations.** Do not re-ask questions whose answers are already encoded in the existing file (language, profile, toggled booleans, existing instructions) — only ask about drifted entries and about features the file does not configure yet.
5. In the following steps, skip any question already answered by the existing config; run the remaining steps normally for unconfigured areas.

### 2. Call AskUserQuestion — baseline settings

**Call AskUserQuestion now with 3 questions. Do not proceed until the user responds.**

- Q1: Language for review comments
  - Options: `ja (Japanese)`, `en-US (English)`, `zh-CN (Chinese)`, `ko (Korean)`
- Q2: Review profile
  - Options: `chill` (balanced, constructive), `assertive` (strict, more feedback — may feel nitpicky), `quiet` (only the most important feedback)
- Q3: CodeRabbit plan (gates later steps)
  - Ask: "Which CodeRabbit plan is this repository on? (Finishing touches and pre-merge checks configuration require Pro+ or above)"
  - Options: `Pro+ or above`, `Pro`, `Lite / Free`, `Not sure`
  - If `Not sure`, treat as below Pro+ and mention that steps 9–10 can be re-run later.

### 3. Call AskUserQuestion — review settings

**Immediately after receiving the response above, call AskUserQuestion with a multiSelect question. Do not proceed until the user responds.**

Present the following boolean settings grouped by category. **Selecting an item toggles that setting away from its default — it does not mean "enable". For example, selecting `high_level_summary` (default: `true`) will disable it, while selecting `poem` (default: `false`) will enable it. Only settings toggled away from their default are written to YAML.**

Ask: "Which review settings would you like to toggle from their defaults? (Select = flip from default; unselected = keep default)"

**Workflow settings:**
- `request_changes_workflow` — Auto-approve PR when all comments are resolved (default: `false`)
- `commit_status` — Set commit status to pending/success during review (default: `true`)
- `fail_commit_status` — Set commit status to failure when review finds issues (default: `false`)

**Summary & overview:**
- `high_level_summary` — Generate high-level change summary (default: `true`)
- `collapse_walkthrough` — Wrap walkthrough in a collapsible section (default: `true`)
- `changed_files_summary` — Include changed files summary (default: `true`)

**Analysis features:**
- `sequence_diagrams` — Generate sequence diagrams (default: `true`)
- `estimate_code_review_effort` — Estimate review effort on a 1–5 scale (default: `true`)
- `assess_linked_issues` — Evaluate how the PR addresses linked issues (default: `true`)

**Related information:**
- `related_issues` — Surface related open issues (default: `true`)
- `related_prs` — Surface related open PRs (default: `true`)

**Suggestions:**
- `suggested_labels` — Suggest PR labels (default: `true`)
- `suggested_reviewers` — Suggest reviewers (default: `true`)

**Status display:**
- `review_status` — Post review status messages in the walkthrough (default: `true`)
- `review_details` — Post review details: ignored files, extra context, etc. (default: `false`)

**Other:**
- `poem` — Generate a poem about the changes (default: `false`)
- `in_progress_fortune` — Post a fortune message while the review is running (default: `true`)
- `enable_prompt_for_ai_agents` — Include prompt for AI agents in review comments (default: `true`)
- `early_access` — Enable experimental features (default: `false`)
- `inheritance` — Enable inheritance from parent configuration (default: `false`)

#### 3a. high_level_summary follow-up

If `high_level_summary` is enabled (i.e., the user did **not** select it to disable it — the default is `true`), immediately call AskUserQuestion with the following questions:

- Q1: Custom instructions for high-level summary generation
  - Ask: "Enter custom instructions for how the high-level summary should be generated (leave blank to use default)"
  - Free-text; only write `high_level_summary_instructions` if the user provides a non-empty value
- Q2: Placeholder token for summary insertion
  - Ask: "Change the summary insertion placeholder? (default: `@coderabbitai summary`)"
  - Options: `Keep default (@coderabbitai summary)`, `Change to a custom value`
  - If "Change": ask for the new string; only write `high_level_summary_placeholder` if different from the default
- Q3: Place summary in the walkthrough section instead of the PR description?
  - Ask: "Place the high-level summary inside the walkthrough section? (default: `false`)"
  - Options: `No — keep in PR description (default)`, `Yes — place in walkthrough section`
  - Only write `high_level_summary_in_walkthrough: true` if "Yes" is selected

### 4. Call AskUserQuestion — linters & SAST tools

**Immediately after receiving the response above, handle the tools relevant to the languages detected in step 1** (see `references/tools-by-language.md`). All tools are enabled by default, so this step decides config files and opt-outs — not enablement.

Run these sub-steps, each with its own AskUserQuestion call (skip a sub-step when nothing was detected for it):

**4a. Detected tool config files.** For each linter/SAST config file found in step 1, the corresponding CodeRabbit tool picks it up automatically. Call AskUserQuestion (multiSelect) listing each detected config (e.g. `.eslintrc.json → eslint`, `.rubocop.yml → rubocop`): "These linter/SAST configs were detected and will be used by CodeRabbit automatically. Select any tool you want to **disable** instead." Selected tools get `reviews.tools.<key>.enabled: false`; unselected tools stay enabled with their config (write nothing). If a detected config lives at a non-standard path and the tool supports the `config_file` option (`swiftlint`, `golangci-lint`, `detekt`, `pmd`, `semgrep`, `sqlfluff`), offer to pin it via `config_file`.

**4b. Missing required configs.** For each detected language whose tool **requires a config file to run meaningfully** (group 1 in `references/tools-by-language.md`: PHPStan → `phpstan.neon` with `paths:`, Stylelint → `.stylelintrc*`, ast-grep → `sgconfig.yml` + rules, Semgrep custom rules → rules YAML) where no config file was found, call AskUserQuestion per tool:
- Options: `Create a default config file (recommended)`, `Disable the tool in .coderabbit.yaml`, `Skip — leave as is`
- If "Create": generate a minimal, working default config for that tool (e.g. a `phpstan.neon` with `level` and `paths:` covering the detected source dirs), show it to the user, and write it alongside `.coderabbit.yaml` after confirmation.
- If "Disable": write `reviews.tools.<key>.enabled: false`.

**4c. Default-off tools.** Check `references/tools-by-language.md` for tools that are disabled by default in the current schema. As of the current schema **all tools default to enabled**, so this sub-step is usually a no-op — but if the reference lists any default-off tool relevant to the project, call AskUserQuestion asking whether to enable it, and write `reviews.tools.<key>.enabled: true` only if the user opts in.

### 5. Call AskUserQuestion — select areas for path_instructions

**Immediately after receiving the response above, call AskUserQuestion again. Do not proceed until the user responds.**

Show only areas actually detected in step 1 (multiSelect):
- Each monorepo module (e.g., `api/ (Go)`, `frontend/ (TypeScript/React)`, `backend/ (Ruby/Rails)`)
- DB migration paths (`db/migrate/`, `prisma/migrations/`, etc.)
- SQL files (`**/*.sql`)
- OpenAPI / Swagger spec files
- Markdown / documentation files
- Test directories (`spec/`, `__tests__/`, etc.)
- Other detected patterns (e.g., `*.sh`)

Ask: "Which areas should have specific review instructions? (Select none to skip)"

### 6. Call AskUserQuestion — one area at a time

**For each selected area, call AskUserQuestion separately. Do not batch multiple areas. Wait for each response before moving to the next.**

**DB migrations (`db/migrate/`, `prisma/migrations/`, etc.)** — multiSelect:
- Require rollback path (`down` method or equivalent)
- Warn on operations against large-data tables (downtime risk)
- Check for missing indexes (foreign keys, frequently queried columns)
- Recommend online schema change tools (gh-ost / pt-osc)
- Check for missing NOT NULL constraints or default values

**SQL files (`**/*.sql`)** — multiSelect:
- Performance (full scans, unused indexes)
- SQL injection risk
- Transaction boundary correctness
- Naming convention consistency

**API spec (openapi / swagger)** — ask 2 questions:

Q1 (multiSelect):
- Detect breaking changes (removed fields, type changes, renamed endpoints)
- Response type and status code completeness
- Missing auth/authorization documentation
- Spec compliance

Q2 (single select):
- Auto-generated from code (focus review on code changes)
- Hand-written (review the spec itself thoroughly)

**Frontend module** — multiSelect:
- Accessibility (WCAG 2.1 AA: alt attributes, aria labels, keyboard navigation)
- Bundle size impact (large library imports)
- XSS risks (`dangerouslySetInnerHTML`, etc.)
- React hooks rules, unnecessary re-renders
- SSR / hydration errors (Next.js, etc.)
- Responsive design

**Backend / API server module** — multiSelect:
- Missing auth/authorization checks
- Input validation completeness
- Error response format consistency
- N+1 queries / performance
- Security (injection, SSRF, excessive permissions)
- PII / secrets leaking into logs

**Rails `app/models/`** — multiSelect:
- Validation completeness
- N+1-inducing associations
- Callback side effects
- Scope usage correctness

**Rails `app/controllers/`** — multiSelect:
- Missing auth/authorization `before_action`
- Strong parameters configuration
- Business logic leaking into controllers
- Response format consistency

**Markdown / documentation** — multiSelect:
- Broken links
- Heading hierarchy consistency
- API documentation completeness (all endpoints/parameters documented)
- Writing style and terminology consistency
- Code sample accuracy

**Tests** — multiSelect:
- Meaningful assertions (not just checking shape)
- Over-mocking (tests that don't actually test behavior)
- Edge case and error path coverage
- Test naming convention consistency
- Test independence (no inter-test dependencies)

**Mobile module** — multiSelect:
- Platform guidelines (iOS HIG / Material Design)
- Memory leaks, uncancelled async operations
- Sensitive data local storage
- Offline handling

### 7. Confirm path_instructions content

Generate the `path_instructions` text for each selected area based on the answers above.
**Show the proposed instructions to the user and call AskUserQuestion to confirm before proceeding.**
Apply any requested edits.

### 8. Call AskUserQuestion — path_filters

**Call AskUserQuestion now. Do not proceed until the user responds.**

Present detected build/vendor/lock-file paths as a multiSelect.
Ask: "Confirm paths to exclude from review. Add or remove as needed."

### 9. Call AskUserQuestion — finishing_touches (Pro+ only)

**Skip this step entirely (and do not write any `finishing_touches` YAML) unless the user answered `Pro+ or above` in step 2 Q3.** Reference: https://docs.coderabbit.ai/finishing-touches

Call AskUserQuestion: "Configure finishing touches (one-click post-review actions)?" Options: `Yes — configure now`, `No — keep defaults`. If "No", write nothing and go to step 10.

If "Yes", call AskUserQuestion (multiSelect) with the same flip-from-default semantics as step 3:

- `docstrings` — Generate docstrings follow-up PRs (default: **enabled**; select to disable)
- `unit_tests` — Generate unit test suggestions (default: **enabled**; select to disable)
- `autofix` — 🪄 Autofix checkboxes / `@coderabbitai autofix` (default: **enabled**; select to disable)
- `simplify` — ✨ Simplify code (default: **disabled**; select to enable)

Then ask: "Add custom finishing-touch recipes? (up to 5, triggered via `@coderabbitai run <recipe name>`)" Options: `Yes`, `No`.
If "Yes", collect for each recipe: `name` (1–100 chars) and `instructions` (1–10,000 chars). Reject additions beyond 5 items.

### 10. Call AskUserQuestion — pre_merge_checks (Pro+ only)

**Skip this step entirely (and do not write any `pre_merge_checks` YAML) unless the user answered `Pro+ or above` in step 2 Q3.** Reference: https://docs.coderabbit.ai/pr-reviews/pre-merge-checks

Call AskUserQuestion: "Configure pre-merge checks (quality gates before merging)?" Options: `Yes — configure now`, `No — keep defaults`. If "No", write nothing and go to step 11.

If "Yes":

1. Call AskUserQuestion (multiSelect): "Which built-in checks do you want to change from the default `warning` mode?" — `docstrings` (docstring coverage, default threshold 80%), `title`, `description`, `issue_assessment`.
2. For each selected check, ask its `mode`: `off`, `warning` (default), `error` (blocks merge when `request_changes_workflow` is enabled). Built-in checks have **no `enabled` field** — only write the `mode` (and sub-fields) for checks changed from the default.
   - For `docstrings`: also ask whether to change `threshold` (0–100, default 80).
   - For `title`: also ask for optional `requirements` free text (e.g. "imperative verb, under 50 characters").
3. Ask: "Add custom pre-merge checks? (up to 50; natural-language pass/fail criteria)" If yes, collect for each: `name` (1–50 chars), `instructions` (1–10,000 chars, deterministic pass/fail criteria), `mode` (default `warning`). Reject additions beyond 50 items.
4. Ask: "Restrict overriding failed checks to requested reviewers only? (default: no)" — only write `override_requested_reviewers_only: true` if yes.

### 11. Validate YAML against schema

Before showing or writing the final YAML, run through this checklist mentally:

1. **No unknown keys** — every field name exists in `references/schema.md` or `references/tools-by-language.md` (schema enforces `additionalProperties: false`)
2. **String length constraints** — `path_instructions[].instructions` ≤ 20,000 chars; `labeling_instructions[].instructions` ≤ 3,000 chars; see `references/schema.md#validation-rules` for the full list (`tone_instructions` was already validated at Q&A input time in step 2)
3. **Array size limits** — `finishing_touches.custom` ≤ 5 items; `pre_merge_checks.custom_checks` ≤ 50 items; `linked_repositories` ≤ 20 items
4. **Valid enum values** — `language` is a valid ISO locale; `profile` is `quiet`, `chill`, or `assertive`; `mode` fields use `off`/`warning`/`error`; `scope` fields use `local`/`global`/`auto`
5. **Required fields present** — each `path_instructions` entry has both `path` and `instructions`; each `labeling_instructions` entry has both `label` and `instructions`; each `finishing_touches.custom` / `pre_merge_checks.custom_checks` entry has `name` and `instructions`
6. **Numeric ranges** — `pre_merge_checks.docstrings.threshold` is between 0 and 100; `knowledge_base.learnings.approval_delay` is an integer between 0 and 30
7. **No `enabled` under built-in pre-merge checks** — `pre_merge_checks.docstrings/title/description/issue_assessment` are controlled via `mode` only

**If any check fails:**
- List all validation errors with the specific field path and the violated constraint (e.g., "`path_instructions[0].instructions` exceeds 20,000-character limit")
- Call AskUserQuestion: "Validation found issues with the generated YAML. Would you like to fix them now or continue anyway?"
  - Options: `Fix now (recommended)`, `Continue without fixing — note: CodeRabbit enforces additionalProperties: false at runtime and will reject invalid YAML`
- If the user selects "Fix now": present the corrected version of each affected field/section and regenerate

**If all checks pass:** proceed to show the final YAML to the user as described in the YAML generation rules below.

---

## YAML generation rules (after all questions are answered)

1. **Output only fields the user explicitly requested or confirmed.** If not discussed, omit it.
2. **Never write a field whose value equals the schema default.** Do not "confirm" defaults by writing them.
3. **Only output `reviews.tools` entries produced by step 4** (explicit disables, `config_file` paths, or opt-ins for default-off tools). All tools are on by default — never write `enabled: true` for a tool that is already on by default.
4. **NEVER output any `chat` field** unless the user asked to change it.
5. **Boolean review settings (step 3)**: only write a field if the user explicitly toggled it from its default. Fields left at their default MUST be omitted.
6. **`high_level_summary` string fields**: only write `high_level_summary_instructions` if non-empty; only write `high_level_summary_placeholder` if different from the default `"@coderabbitai summary"`; only write `high_level_summary_in_walkthrough: true` if the user selected "Yes".
7. **Top-level vs `reviews:` placement**:
   - `early_access` and `inheritance` are top-level fields and MUST NOT be placed under `reviews:`.
   - All other review settings from step 3 belong under `reviews:`.
8. Include only the `path_instructions` confirmed in step 7.
9. Include only the `path_filters` confirmed in step 8.
10. **`finishing_touches` / `pre_merge_checks` (steps 9–10)**: only write when the user is on Pro+ or above AND chose to configure them; within them, only write values that differ from schema defaults (e.g. `simplify.enabled: true`, a `mode` changed from `warning`, a non-default `threshold`).
11. **Update mode (step 1a)**: apply the migrate/keep/remove decisions from the drift report; never silently drop or rewrite still-valid entries the user chose to keep.
12. **Schema compliance (pre-generation)**:
    - For `reviews.tools`, use only keys listed in `references/tools-by-language.md` — no other tool names are valid.
    - If the user's `tone_instructions` input exceeds 250 characters during the Q&A phase (step 2), warn at that point and ask them to shorten it before proceeding. Step 11 will not re-check this field.
    - If adding a custom array item (`finishing_touches.custom` max 5, `pre_merge_checks.custom_checks` max 50, or `knowledge_base.linked_repositories` max 20) would exceed its array size limit, reject the addition and inform the user of the limit.
    - Official schema reference: https://www.coderabbit.ai/integrations/schema.v2.json

Show the final YAML to the user before writing.
- New file: write after showing.
- Existing file: show a diff and ask for confirmation before overwriting.
