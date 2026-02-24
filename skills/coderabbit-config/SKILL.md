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

- Does `.coderabbit.yaml` exist? (if yes, read it)
- Is it a monorepo? (top-level dirs: `api/`, `backend/`, `frontend/`, `app/`, `web/`, `mobile/`, `ios/`, `android/`, `packages/`, `services/`, `apps/`)
- Workspace markers: `pnpm-workspace.yaml`, `nx.json`, `lerna.json`, `turbo.json`
- Per module/root, detect language: Go (`go.mod`), TypeScript (`package.json`+`tsconfig.json`), Rails (`Gemfile`+`app/` or `db/migrate/`), Python (`pyproject.toml`), Rust (`Cargo.toml`), PHP (`composer.json`)
- DB paths: `db/migrate/`, `*/db/migrate/`, `prisma/migrations/`, `**/migrations/`, `**/*.sql`
- API specs: `**/openapi.yaml`, `**/swagger.yaml`, `**/openapi.json`, `**/swagger.json`, `api-docs/`, `docs/api/`
- Markdown: any `.md` files beyond `README.md`
- Test dirs: `spec/`, `test/`, `tests/`, `__tests__/`, `**/*.test.*`, `**/*.spec.*`
- Build/vendor/lock-file paths: `dist/`, `build/`, `node_modules/`, `vendor/`, `.venv/`, `.next/`, `target/`, `__pycache__/`, `coverage/`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `Cargo.lock`, `poetry.lock`, `Gemfile.lock`

Present findings to the user before asking any questions.

### 2. Call AskUserQuestion — baseline settings

**Call AskUserQuestion now with 2 questions. Do not proceed until the user responds.**

- Q1: Language for review comments
  - Options: `ja (Japanese)`, `en-US (English)`, `zh-CN (Chinese)`, `ko (Korean)`
- Q2: Review tone
  - Options: `chill` (constructive, encouraging), `assertive` (strict, direct)

### 3. Call AskUserQuestion — review settings

**Immediately after receiving the response above, call AskUserQuestion with a multiSelect question. Do not proceed until the user responds.**

Present the following boolean settings grouped by category. **Selecting an item toggles that setting away from its default — it does not mean "enable". For example, selecting `high_level_summary` (default: `true`) will disable it. Only settings toggled away from their default are written to YAML.**

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
- `poem` — Generate a poem about the changes (default: `true`)
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

### 4. Call AskUserQuestion — select areas for path_instructions

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

### 5. Call AskUserQuestion — one area at a time

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

### 6. Confirm path_instructions content

Generate the `path_instructions` text for each selected area based on the answers above.
**Show the proposed instructions to the user and call AskUserQuestion to confirm before proceeding.**
Apply any requested edits.

### 7. Call AskUserQuestion — path_filters

**Call AskUserQuestion now. Do not proceed until the user responds.**

Present detected build/vendor/lock-file paths as a multiSelect.
Ask: "Confirm paths to exclude from review. Add or remove as needed."

### 8. Validate YAML against schema

Before showing or writing the final YAML, run through this checklist mentally:

1. **No unknown keys** — every field name exists in `references/schema.md` or `references/tools-by-language.md` (schema enforces `additionalProperties: false`)
2. **String length constraints** — `path_instructions[].instructions` ≤ 20,000 chars; `labeling_instructions[].instructions` ≤ 3,000 chars; see `references/schema.md#validation-rules` for the full list (`tone_instructions` was already validated at Q&A input time in step 2)
3. **Array size limits** — `finishing_touches.custom` ≤ 5 items; `pre_merge_checks.custom_checks` ≤ 5 items; `linked_repositories` ≤ 1 item
4. **Valid enum values** — `language` is a valid ISO locale; `profile` is `chill` or `assertive`; `mode` fields use `off`/`warning`/`error`; `scope` fields use `local`/`global`/`auto`
5. **Required fields present** — each `path_instructions` entry has both `path` and `instructions`; each `labeling_instructions` entry has both `label` and `instructions`
6. **Numeric ranges** — `docstrings.threshold` is between 0 and 100

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
3. **NEVER output `reviews.tools`** — all tools are on by default. Only include if the user explicitly asks to disable a specific tool.
4. **NEVER output any `chat` field** unless the user asked to change it.
5. **Boolean review settings (step 3)**: only write a field if the user explicitly toggled it from its default. Fields left at their default MUST be omitted.
6. **`high_level_summary` string fields**: only write `high_level_summary_instructions` if non-empty; only write `high_level_summary_placeholder` if different from the default `"@coderabbitai summary"`; only write `high_level_summary_in_walkthrough: true` if the user selected "Yes".
7. **Top-level vs `reviews:` placement**:
   - `early_access` and `inheritance` are top-level fields and MUST NOT be placed under `reviews:`.
   - All other review settings from step 3 belong under `reviews:`.
8. Include only the `path_instructions` confirmed in step 6.
9. Include only the `path_filters` confirmed in step 7.
10. **Schema compliance (pre-generation)**:
    - For `reviews.tools`, use only keys listed in `references/tools-by-language.md` — no other tool names are valid.
    - If the user's `tone_instructions` input exceeds 250 characters during the Q&A phase (step 2), warn at that point and ask them to shorten it before proceeding. Step 8 will not re-check this field.
    - If adding a custom array item (`finishing_touches.custom`, `pre_merge_checks.custom_checks`, or `knowledge_base.linked_repositories`) would exceed its array size limit, reject the addition and inform the user of the limit.
    - Official schema reference: https://www.coderabbit.ai/integrations/schema.v2.json

Show the final YAML to the user before writing.
- New file: write after showing.
- Existing file: show a diff and ask for confirmation before overwriting.
