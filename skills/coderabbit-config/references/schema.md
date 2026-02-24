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
| `profile` | `"chill"` \| `"assertive"` | `"chill"` | `chill` = constructive; `assertive` = strict |
| `request_changes_workflow` | boolean | `false` | Auto-approve when all comments resolved |
| `abort_on_close` | boolean | `true` | Stop review if PR closes |
| `high_level_summary` | boolean | `true` | Generate change summary |
| `high_level_summary_instructions` | string | — | Customize how the high-level summary is generated |
| `high_level_summary_in_walkthrough` | boolean | `false` | Place summary in walkthrough section |
| `auto_title_instructions` | string | — | Customize how PR titles are auto-generated |
| `review_status` | boolean | `true` | Post review status messages in walkthrough |
| `review_details` | boolean | `false` | Post review details (ignored files, extra context, etc.) |
| `commit_status` | boolean | `true` | Set commit status to pending/success during review |
| `collapse_walkthrough` | boolean | `true` | Wrap walkthrough in collapsible section |
| `sequence_diagrams` | boolean | `true` | Generate sequence diagrams |
| `poem` | boolean | `true` | Generate a poem about the changes |
| `changed_files_summary` | boolean | `true` | Include changed files summary |
| `estimate_code_review_effort` | boolean | `true` | Estimate review effort (1–5) |
| `assess_linked_issues` | boolean | `true` | Evaluate how PR addresses linked issues |
| `related_issues` | boolean | `true` | Surface related open issues |
| `related_prs` | boolean | `true` | Surface related open PRs |
| `suggested_labels` | boolean | `true` | Suggest PR labels |
| `labeling_instructions` | array | `[]` | Define allowed labels and when to suggest them |
| `auto_apply_labels` | boolean | `false` | Automatically apply suggested labels |
| `suggested_reviewers` | boolean | `true` | Suggest reviewers |
| `auto_assign_reviewers` | boolean | `false` | Automatically assign suggested reviewers |
| `path_filters` | string[] | `[]` | Glob patterns; prefix `!` to exclude. Evaluated in order. |
| `fail_commit_status` | boolean | `false` | Set commit status to failure when review finds issues |
| `enable_prompt_for_ai_agents` | boolean | `true` | Include prompt for AI agents in review comments |
| `high_level_summary_placeholder` | string | `"@coderabbitai summary"` | Placeholder string where the high-level summary will be inserted |

---

## reviews.auto_review

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable automatic reviews |
| `auto_incremental_review` | boolean | `true` | Re-review on new pushes |
| `ignore_title_keywords` | string[] | `[]` | Skip if PR title contains these (e.g. `["WIP"]`) |
| `labels` | string[] | `[]` | Only review if PR has one of these labels |
| `base_branches` | string[] | `[]` | Only review PRs targeting these branches (regex) |
| `ignore_usernames` | string[] | `[]` | Skip PRs from these authors |
| `drafts` | boolean | `false` | Review draft PRs |

---

## reviews.path_instructions

Array of per-path review instructions.

```yaml
reviews:
  path_instructions:
    - path: "src/api/**"
      instructions: "..."
```

---

## reviews.tools

Each tool: `enabled: boolean`. See `tools-by-language.md` for all YAML keys.

```yaml
reviews:
  tools:
    eslint:
      enabled: true
```

---

## reviews.finishing_touches

| Field | Description |
|-------|-------------|
| `docstrings.enabled` | Generate docstring suggestions |
| `unit_tests.enabled` | Generate unit test suggestions |
| `custom` | Up to 5 custom recipes (`name`, `description`, `instructions`) |

---

## reviews.pre_merge_checks

Each built-in check has an `enabled` boolean and an optional `mode` that controls how a failure is reported.

| Field | Type | Description |
|-------|------|-------------|
| `docstrings.enabled` | boolean | Validate docstring coverage |
| `docstrings.mode` | `"off"` \| `"warning"` \| `"error"` | Failure behavior for docstring check |
| `title.enabled` | boolean | Validate PR title format |
| `title.mode` | `"off"` \| `"warning"` \| `"error"` | Failure behavior for title check |
| `description.enabled` | boolean | Validate PR description quality |
| `description.mode` | `"off"` \| `"warning"` \| `"error"` | Failure behavior for description check |
| `issue_assessment.enabled` | boolean | Verify linked issues are addressed |
| `issue_assessment.mode` | `"off"` \| `"warning"` \| `"error"` | Failure behavior for issue assessment check |
| `custom_checks` | array (max 5) | Custom merge checks (`name`, `instructions`, `mode`) |
| `custom_checks[].mode` | `"off"` \| `"warning"` \| `"error"` | Failure behavior for custom check |

```yaml
reviews:
  pre_merge_checks:
    title:
      enabled: true
      mode: "error"
    custom_checks:
      - name: "No TODO comments"
        instructions: "Fail if any TODO comments are found."
        mode: "warning"
```

---

## chat

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `art` | boolean | `true` | Generate art in chat responses |
| `auto_reply` | boolean | `true` | Reply without `@coderabbitai` mention |
| `integrations.jira.usage` | `"auto"` \| `"disabled"` | — | Jira issue creation |
| `integrations.linear.usage` | `"auto"` \| `"disabled"` | — | Linear issue creation |

---

## knowledge_base

| Field | Type | Description |
|-------|------|-------------|
| `code_guidelines.enabled` | boolean | Apply organizational coding standards |
| `learnings.scope` | `"local"` \| `"global"` \| `"auto"` | Scope of saved learnings |
| `issues.scope` | `"local"` \| `"global"` \| `"auto"` | Issues to include as context |
| `pull_requests.scope` | `"local"` \| `"global"` \| `"auto"` | PRs to include as context |
| `web_search.enabled` | boolean | Enable web search for context |
| `jira.project_keys` | string[] | Jira project keys |
| `linear.team_keys` | string[] | Linear team keys |
| `linked_repositories` | array (max 1) | External repositories to include as review context |
| `linked_repositories[].repository` | string | Repository in `org/repo` format |
| `linked_repositories[].instructions` | string (max 2,000 chars) | Instructions for how to use the linked repo as context |

---

## code_generation

```yaml
code_generation:
  docstrings:
    language: "google"  # "google" | "numpy" | "sphinx"
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
| `auto_enrich` | boolean | `true` | Automatically analyze new issues |
| `planning` | boolean | — | Generate implementation plans |
| `labeling.enabled` | boolean | — | Suggest issue labels |
| `labeling.auto_apply` | boolean | — | Auto-apply suggested labels |

---

## Validation Rules

These rules derive from the schema's `additionalProperties: false` constraints and field-level restrictions. Always verify generated YAML against these before writing.

### Structural Constraints

- `additionalProperties: false` is enforced at every level — any key not defined in the schema causes validation failure.
- Only keys documented in this file and `tools-by-language.md` are valid.

### String Length Limits

| Field | Limit |
|-------|-------|
| `tone_instructions` | max 250 characters |
| `reviews.path_instructions[].instructions` | max 20,000 characters |
| `reviews.labeling_instructions[].instructions` | max 3,000 characters |
| `reviews.finishing_touches.custom[].name` | max 100 characters |
| `reviews.finishing_touches.custom[].instructions` | max 10,000 characters |
| `reviews.pre_merge_checks.custom_checks[].name` | 1–50 characters |
| `reviews.pre_merge_checks.custom_checks[].instructions` | 1–10,000 characters |
| `knowledge_base.linked_repositories[].instructions` | max 2,000 characters |

### Array Size Limits

| Field | Max Items |
|-------|-----------|
| `reviews.finishing_touches.custom` | 5 |
| `reviews.pre_merge_checks.custom_checks` | 5 |
| `knowledge_base.linked_repositories` | 1 |

### Enum Constraints

| Field | Valid Values |
|-------|-------------|
| `language` | ISO locale codes (e.g., `en-US`, `ja`, `zh-CN`, `ko`, `fr`, `de`) |
| `reviews.profile` | `"chill"` \| `"assertive"` |
| `reviews.pre_merge_checks.docstrings.mode`, `.title.mode`, `.description.mode`, `.issue_assessment.mode`, `.custom_checks[].mode` | `"off"` \| `"warning"` \| `"error"` |
| `scope` fields (`learnings.scope`, `issues.scope`, `pull_requests.scope`) | `"local"` \| `"global"` \| `"auto"` |
| `code_generation.docstrings.language` | `"google"` \| `"numpy"` \| `"sphinx"` |
| `chat.integrations.jira.usage` | `"auto"` \| `"disabled"` |
| `chat.integrations.linear.usage` | `"auto"` \| `"disabled"` |

### Numeric Ranges

| Field | Range |
|-------|-------|
| `code_generation.docstrings.threshold` | 0–100 |

### Required Fields

| Array | Required Fields per Item |
|-------|--------------------------|
| `reviews.path_instructions` | `path` and `instructions` |
| `reviews.labeling_instructions` | `label` and `instructions` |
| `reviews.finishing_touches.custom` | `name`, `description`, `instructions` |
| `reviews.pre_merge_checks.custom_checks` | `name`, `instructions` |
| `code_generation.docstrings.path_instructions` | `path` and `instructions` |
| `code_generation.unit_tests.path_instructions` | `path` and `instructions` |
