# cr-house

**cr-house** は、リポジトリを自動解析して [CodeRabbit](https://coderabbit.ai) の設定ファイル (`.coderabbit.yaml`) を生成する CLI ツールです。

言語・フレームワーク・フォルダ構成を検出し、プロジェクトに合ったレビュー設定を対話形式で作成します。

## Features

- リポジトリの言語分布を自動検出 (linguist ベース)
- `package.json` / `pyproject.toml` / `go.mod` / `Cargo.toml` / `pom.xml` などのマニフェストからフレームワークを特定
- `api/`, `frontend/`, `tests/`, `infra/` などのフォルダ役割を推定
- 役割・フレームワークごとのレビュー指示テンプレートを自動生成
- 対話式プロンプトでレビュー言語・プロファイル・カスタム指示を設定
- CI 環境向けの非対話モード (`--no-interactive`) をサポート

## Installation

```bash
npm install -g cr-house
```

または `npx` で直接実行:

```bash
npx cr-house init
```

## Usage

### インタラクティブモード

リポジトリのルートで実行するとウィザードが起動します。

```bash
npx cr-house init
```

1. リポジトリを自動解析して言語・フレームワーク・フォルダ構成を表示
2. レビュー言語・プロファイルを選択
3. 検出された各フォルダのレビュー方針を確認・調整
4. `.coderabbit.yaml` を生成

### 非対話モード

CI/CD パイプラインやスクリプトから使用する場合:

```bash
npx cr-house init --no-interactive
```

すべての設定にデフォルト値が使用され、プロンプトは表示されません。

### オプション

| オプション | デフォルト | 説明 |
|---|---|---|
| `--output <path>` | `.coderabbit.yaml` | 出力ファイルのパス |
| `--no-interactive` | — | 非対話モードで実行 |

### 出力例

```yaml
# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json
language: "ja-JP"
early_access: false
reviews:
  profile: "chill"
  high_level_summary: true
  path_filters:
    - "!node_modules/**"
    - "!dist/**"
  path_instructions:
    - path: "api/**"
      instructions: >-
        Focus on API endpoint security, error handling, and response format
        consistency.
    - path: "frontend/**"
      instructions: >-
        Focus on component reusability, accessibility, and performance.
```

## Supported Languages & Frameworks

| エコシステム | 検出対象 |
|---|---|
| JavaScript / TypeScript | React, Next.js, Vue.js, Nuxt.js, Angular, Svelte, SolidJS, Astro, Remix, Gatsby, Express, Fastify, NestJS, Hono, GraphQL, Prisma, Drizzle ORM, … |
| Python | Django, FastAPI, Flask, Starlette, SQLAlchemy, Celery, … |
| Go | Gin, Echo, Fiber, Chi, GORM, … |
| Rust | Axum, Actix Web, Rocket, Tokio, Diesel, SQLx, … |
| JVM (Java / Kotlin) | Spring Boot, Quarkus, Micronaut, Ktor, Hibernate, … |
| Ruby | Ruby on Rails, Sinatra, Hanami, … |

## License

MIT © 2026 Atsushi Nakatsugawa
