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
| Oxlint | `oxc` | `.oxlintrc.json` |
| React Doctor | `reactDoctor` | — |
| ember-template-lint | `emberTemplateLint` | `.template-lintrc.js` |

### Python
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| Ruff | `ruff` | `pyproject.toml`, `ruff.toml`, `.ruff.toml` |
| Flake8 | `flake8` | `.flake8`, `setup.cfg`, `tox.ini` |
| Pylint | `pylint` | `.pylintrc`, `pyproject.toml` |

### Go
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| golangci-lint | `golangci-lint` | `.golangci.yml` / `.yaml` / `.toml` / `.json` (path settable via `config_file`) |

### Rust
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| Clippy | `clippy` | `clippy.toml`, `.clippy.toml` |

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
| PHP CodeSniffer | `phpcs` | `phpcs.xml`, `phpcs.xml.dist` |

### Java / Kotlin
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| PMD | `pmd` | ruleset XML (path settable via `config_file`) |
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
| Shopify Theme Check | `shopifyThemeCheck` | `.theme-check.yml` |
| smarty-lint | `smartyLint` | — |

### Docs / Data formats
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| markdownlint | `markdownlint` | `.markdownlint.json` / `.yaml`, `.markdownlint-cli2.*` |
| LanguageTool | `languagetool` | — (options: `enabled_rules`, `disabled_rules`, `enabled_categories`, `disabled_categories`, `enabled_only`, `level`) |
| YAMLlint | `yamllint` | `.yamllint`, `.yamllint.yaml` |
| SQLFluff | `sqlfluff` | `.sqlfluff`, `setup.cfg`, `tox.ini`, `pep8.ini`, `pyproject.toml` (path settable via `config_file`) — without one, CodeRabbit writes a temporary config from the review profile and detected SQL dialect; a committed `.sqlfluff` pins the dialect and rules |
| Buf (Protobuf) | `buf` | `buf.yaml` |
| Regal (Rego) | `regal` | `.regal.yaml` |
| Prisma Schema linting | `prismaLint` | — |
| dotenv-linter | `dotenvLint` | — |
| oasdiff (OpenAPI breaking changes) | `oasdiff` | — |

### CI/CD
| Tool | YAML key | Config file (used if present) |
|------|----------|-------------------------------|
| actionlint (GitHub Actions) | `actionlint` | — |
| zizmor (GitHub Actions security) | `zizmor` | `zizmor.yml` |
| CircleCI config checker | `circleci` | — (checks `.circleci/config.yml`) |
| GitHub Checks integration | `github-checks` | — (`timeout_ms` option, 0–900,000, default 90,000) |

### Security / SAST
| Tool | YAML key | Config file |
|------|----------|-------------|
| Semgrep | `semgrep` | **Required — Semgrep only runs if a config exists:** `semgrep.yml` / `.yaml`, `semgrep.config.yml` / `.yaml` in repo root; path settable via `config_file` |
| OpenGrep | `opengrep` | — |
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
| ast-grep | `ast-grep` | `sgconfig.yml` + rule dirs; configured via `rule_dirs`, `util_dirs`, `essential_rules`, `packages` in `.coderabbit.yaml` (no `enabled` field) |

## Config-file guidance for the setup flow

Tools fall into three groups:

1. **Config required to run** — the tool does not run at all without a config file:
   - **Semgrep** — runs only if `semgrep.yml` / `semgrep.config.yml` (or `config_file`) exists.
   - **PHPStan** — requires `phpstan.neon` / `phpstan.neon.dist` with `paths:` in the repo root.
   If the project matches the tool's file types but the config file is missing, offer to create a minimal default config file (or leave the tool dormant).
2. **Config optional, honored when present** — ESLint, Biome, Ruff, RuboCop, golangci-lint, detekt, SwiftLint, SQLFluff, Stylelint, markdownlint, YAMLlint, TFLint, Checkov, Hadolint, etc. If a config file exists, the tool automatically uses it — confirm with the user that the tool should stay enabled with that config, and whether to pin a non-standard path via `config_file` (only for tools that support the `config_file` option: `swiftlint`, `golangci-lint`, `detekt`, `pmd`, `semgrep`, `sqlfluff`).
   Within this group, some tools fall back to an auto-generated config, so a committed config is **recommended for deterministic results**: SQLFluff (temporary config from profile + detected dialect — commit `.sqlfluff` to pin the dialect), Stylelint (auto default `.stylelintrc.json`), ast-grep (essentials package runs via `essential_rules: true`; custom rules need `sgconfig.yml` + `rule_dirs`/`packages`). When the matching file types are detected but no config exists, offer to create one.
3. **No config** — runs out of the box (e.g. Cppcheck, actionlint, oasdiff, OSV Scanner, TruffleHog).
