# CodeRabbit Tools — YAML Key Reference

Source: `reviews.tools` in https://www.coderabbit.ai/integrations/schema.v2.json

**All tools default to `enabled: true`** in the current schema — there are no default-off tools right now. Only write a `reviews.tools` entry when the user explicitly disables a tool or sets a tool-specific option (e.g. `config_file`). If a future schema version ships a default-off tool, ask the user whether to enable it during setup.

YAML keys are exact and case-sensitive (note the hyphenated keys `golangci-lint`, `ast-grep`, `github-checks` and camelCase keys like `osvScanner`).

## Tool Keys by Language

### JavaScript / TypeScript
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| ESLint | `eslint` | `eslint.config.*`, `.eslintrc*` |
| Biome | `biome` | `biome.json`, `biome.jsonc` |
| Oxlint | `oxc` | **Required — runs only when a config exists and Biome is disabled:** `.oxlintrc.json`, `oxlintrc.json`, `.oxlintrc`, `oxlint.json` |
| React Doctor | `reactDoctor` | — |
| ember-template-lint | `emberTemplateLint` | `.template-lintrc.js` |

### Python
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| Ruff | `ruff` | `pyproject.toml`, `ruff.toml`, `.ruff.toml` |
| Flake8 | `flake8` | **Required — will not run without:** `.flake8` |
| Pylint | `pylint` | **Required — will not run without:** `.pylintrc`, `pylintrc`, `.pylintrc.toml`, `pylintrc.toml` |

### Go
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| golangci-lint | `golangci-lint` | `.golangci.yml` / `.yaml` / `.toml` / `.json` (path settable via `config_file`) |

### Rust
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| Clippy | `clippy` | `clippy.toml`, `.clippy.toml` (official tools list marks a config as required; a `Cargo.toml` must exist) |

### Ruby / Rails
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| RuboCop | `rubocop` | `.rubocop.yml` |
| Brakeman (SAST) | `brakeman` | `config/brakeman.yml` |

### PHP
| Tool | YAML key | Config file |
|------|----------|-------------|
| PHPStan | `phpstan` | **Required:** `phpstan.neon` / `phpstan.neon.dist` in repo root, containing `paths:`. Also supports `level` option in `.coderabbit.yaml`. |
| PHPMD | `phpmd` | ruleset XML if present |
| PHP CodeSniffer | `phpcs` | **Required — will not run without:** `phpcs.xml`, `phpcs.xml.dist` (must contain `<ruleset` / `<?xml`) |

### Java / Kotlin
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| PMD | `pmd` | `ruleset.xml` in repo root (path settable via `config_file`); without one, CodeRabbit generates a default ruleset from the review profile — official tools list marks a config as required |
| detekt | `detekt` | `detekt.yml` (path settable via `config_file`) |
| Infer (Java, C/C++) | `fbinfer` | — (`enable_java` option, default `false`) |

### C / C++
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| Cppcheck | `cppcheck` | — |
| Clang | `clang` | — |

### Swift
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| SwiftLint | `swiftlint` | `.swiftlint.yml` (path settable via `config_file`) |

### Shell / Scripts
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| ShellCheck | `shellcheck` | `.shellcheckrc` |
| PSScriptAnalyzer (PowerShell) | `psscriptanalyzer` | `PSScriptAnalyzerSettings.psd1` |
| Blinter (Windows batch) | `blinter` | — |
| checkmake (Makefiles) | `checkmake` | `checkmake.ini` |
| Luacheck (Lua) | `luacheck` | `.luacheckrc` |
| Fortitude (Fortran) | `fortitudeLint` | `fpm.toml`, `fortitude.toml` |

### Web / Styles / Templates
| Tool | YAML key | Config file |
|------|----------|-------------|
| Stylelint | `stylelint` | `.stylelintrc*`, `stylelint.config.*` — without one, CodeRabbit auto-generates a default `.stylelintrc.json` (extends `stylelint-config-standard-scss`) |
| HTMLHint | `htmlhint` | `.htmlhintrc` |
| Shopify Theme Check (Shopify CLI) | `shopifyThemeCheck` | **Required per official tools list:** `.theme-check.yml` |
| smarty-lint | `smartyLint` | `smartylint.json` (a `smartylint.js` causes the tool to be skipped); without one, CodeRabbit creates a temporary config scanning `**/*.tpl` — official tools list marks a config as required |

### Docs / Data formats
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| markdownlint | `markdownlint` | `.markdownlint.json` / `.yaml`, `.markdownlint-cli2.*` |
| LanguageTool | `languagetool` | — (options: `enabled_rules`, `disabled_rules`, `enabled_categories`, `disabled_categories`, `enabled_only`, `level`) |
| YAMLlint | `yamllint` | `.yamllint`, `.yamllint.yaml` |
| SQLFluff | `sqlfluff` | **Required per official tools list:** `.sqlfluff`, `setup.cfg`, `tox.ini`, `pep8.ini`, `pyproject.toml` (path settable via `config_file`); per-tool docs describe a temporary fallback config from the review profile and detected dialect — commit `.sqlfluff` to pin the dialect and rules |
| Buf (Protobuf) | `buf` | `buf.yaml` |
| Regal (Rego) | `regal` | `.regal.yaml` |
| Prisma Lint | `prismaLint` | **Required — will not run without:** `.prismalintrc.json`, `.prismalintrc`, `.prismalintrc.js`, `.prismalintrc.yaml`, `.prismalintrc.yml`, `prismalint.config.js` |
| dotenv-linter | `dotenvLint` | official tools list marks a config as required; per-tool docs document no config filenames and default settings for `.env` files |
| oasdiff (OpenAPI breaking changes) | `oasdiff` | — |

### CI/CD
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| actionlint (GitHub Actions) | `actionlint` | — |
| zizmor (GitHub Actions security) | `zizmor` | `zizmor.yml` |
| CircleCI config checker | `circleci` | **Required:** `.circleci/config.yml` / `.yaml` is both the config and the review target — nothing runs without it |
| GitHub Checks integration | `github-checks` | — (`timeout_ms` option, 0–900,000, default 90,000) |

### Security / SAST
| Tool | YAML key | Config file |
|------|----------|-------------|
| Semgrep | `semgrep` | **Required — Semgrep only runs if a config exists:** `semgrep.yml` / `.yaml`, `semgrep.config.yml` / `.yaml` in repo root; path settable via `config_file` |
| OpenGrep | `opengrep` | `opengrep.yml` / `.yaml`, `opengrep.config.yml` / `.yaml`, or the Semgrep filenames; without one, CodeRabbit writes a temporary fallback config from the review profile — official tools list marks a config as required |
| Trivy (IaC security) | `trivy` | `trivy.yaml` |
| Checkov (IaC) | `checkov` | `.checkov.yaml` |
| TFLint (Terraform) | `tflint` | `.tflint.hcl` |
| Hadolint (Dockerfile) | `hadolint` | `.hadolint.yaml` |
| Betterleaks (secrets; improved Gitleaks) | `gitleaks` | `.gitleaks.toml` |
| TruffleHog (secrets) | `trufflehog` | — |
| OSV Scanner (dependency vulnerabilities) | `osvScanner` | — |
| Presidio (PII detection) | `presidio` | repo Presidio config (e.g. `.presidiocli`) overrides built-in defaults |
| SkillSpector (AI agent skills) | `skillspector` | — (scans `SKILL.md` manifests and MCP configurations) |

### Cross-language
| Tool | YAML key | Config file |
|------|----------|-------------|
| ast-grep | `ast-grep` | **Required — runs only when at least one of `rule_dirs`, `essential_rules: true`, or `packages` is configured in `.coderabbit.yaml`** (no `enabled` field; `util_dirs` alone does not trigger it) |

## Config-file guidance for the setup flow

Tools fall into three groups:

1. **Config file required** (per the official tools list at https://docs.coderabbit.ai/tools/). When the project contains the tool's target file types but the config file is missing, offer to create a minimal default config file (or disable / leave the tool dormant):

   | Tool (YAML key) | Trigger file types | Config file to check/create |
   |------|--------------------|------------------------------|
   | ast-grep (`ast-grep`) | any code | `rule_dirs` / `essential_rules: true` / `packages` in `.coderabbit.yaml` |
   | CircleCI (`circleci`) | `.circleci/` | `.circleci/config.yml` |
   | Clippy (`clippy`) | Rust (`Cargo.toml`) | `clippy.toml`, `.clippy.toml` |
   | Dotenv Linter (`dotenvLint`) | `.env*` files | — (no documented filename; confirm usage only) |
   | Flake8 (`flake8`) | Python | `.flake8` |
   | OpenGrep (`opengrep`) | any code | `opengrep.yml` (or Semgrep filenames) |
   | Oxlint (`oxc`) | JS/TS (and Biome disabled) | `.oxlintrc.json` |
   | PHPCS (`phpcs`) | PHP | `phpcs.xml`, `phpcs.xml.dist` |
   | PHPStan (`phpstan`) | PHP | `phpstan.neon` with `paths:` |
   | PMD (`pmd`) | Java | `ruleset.xml` (or `config_file`) |
   | Prisma Lint (`prismaLint`) | `prisma/*.prisma` | `.prismalintrc.json` etc. |
   | Pylint (`pylint`) | Python | `.pylintrc` / `pylintrc` / `.pylintrc.toml` / `pylintrc.toml` |
   | Semgrep (`semgrep`) | any code | `semgrep.yml` / `semgrep.config.yml` (or `config_file`) |
   | Shopify CLI (`shopifyThemeCheck`) | Shopify theme | `.theme-check.yml` |
   | smarty-lint (`smartyLint`) | `**/*.tpl` | `smartylint.json` |
   | SQLFluff (`sqlfluff`) | `**/*.sql` | `.sqlfluff` (pins dialect and rules) |

   Note: per-tool docs describe an auto-generated fallback config for some of these (OpenGrep, PMD, smarty-lint, SQLFluff, and Clippy/Dotenv Linter run with defaults). Treat the official required list above as authoritative for prompting; where a fallback exists, present "keep auto-generated config" as an alternative to creating the file.

2. **Config optional, honored when present** — ESLint, Biome, Ruff, RuboCop, golangci-lint, detekt, SwiftLint, Stylelint, markdownlint, YAMLlint, TFLint, Checkov, Hadolint, etc. If a config file exists, the tool automatically uses it — confirm with the user that the tool should stay enabled with that config, and whether to pin a non-standard path via `config_file` (only for tools that support the `config_file` option: `swiftlint`, `golangci-lint`, `detekt`, `pmd`, `semgrep`, `sqlfluff`). Stylelint falls back to an auto-generated default `.stylelintrc.json` (extends `stylelint-config-standard-scss`) — offer to commit one for deterministic results.
3. **No config** — runs out of the box (e.g. Cppcheck, actionlint, oasdiff, OSV Scanner, TruffleHog).
