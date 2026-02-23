import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { FrameworkMap } from '../types.js';

// ── JavaScript / Node.js ──────────────────────────────────────────────────────

interface JsRule {
  deps: string[];
  name: string;
}

const JS_FRAMEWORK_RULES: JsRule[] = [
  { deps: ['next'], name: 'Next.js' },
  { deps: ['nuxt', '@nuxt/core'], name: 'Nuxt.js' },
  { deps: ['react', 'react-dom'], name: 'React' },
  { deps: ['vue'], name: 'Vue.js' },
  { deps: ['svelte'], name: 'Svelte' },
  { deps: ['@angular/core'], name: 'Angular' },
  { deps: ['solid-js'], name: 'SolidJS' },
  { deps: ['astro'], name: 'Astro' },
  { deps: ['remix', '@remix-run/node'], name: 'Remix' },
  { deps: ['gatsby'], name: 'Gatsby' },
  { deps: ['express'], name: 'Express' },
  { deps: ['fastify'], name: 'Fastify' },
  { deps: ['@nestjs/core'], name: 'NestJS' },
  { deps: ['koa'], name: 'Koa' },
  { deps: ['hono'], name: 'Hono' },
  { deps: ['@hapi/hapi'], name: 'Hapi' },
  { deps: ['graphql', 'apollo-server', '@apollo/server'], name: 'GraphQL' },
  { deps: ['prisma', '@prisma/client'], name: 'Prisma' },
  { deps: ['typeorm'], name: 'TypeORM' },
  { deps: ['mongoose'], name: 'Mongoose' },
  { deps: ['drizzle-orm'], name: 'Drizzle ORM' },
  { deps: ['vite'], name: 'Vite' },
  { deps: ['webpack'], name: 'Webpack' },
  { deps: ['vitest'], name: 'Vitest' },
  { deps: ['jest'], name: 'Jest' },
  { deps: ['playwright', '@playwright/test'], name: 'Playwright' },
  { deps: ['cypress'], name: 'Cypress' },
  { deps: ['electron'], name: 'Electron' },
];

async function detectJsFrameworks(directory: string): Promise<string[]> {
  let pkg: Record<string, Record<string, string>>;
  try {
    pkg = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8')) as typeof pkg;
  } catch {
    return [];
  }

  const allDeps = {
    ...pkg['dependencies'],
    ...pkg['devDependencies'],
    ...pkg['peerDependencies'],
  };

  return JS_FRAMEWORK_RULES
    .filter(rule => rule.deps.some(dep => dep in allDeps))
    .map(rule => rule.name);
}

// ── Python ────────────────────────────────────────────────────────────────────

interface PatternRule {
  pattern: RegExp;
  name: string;
}

const PYTHON_FRAMEWORK_RULES: PatternRule[] = [
  { pattern: /django/i, name: 'Django' },
  { pattern: /fastapi/i, name: 'FastAPI' },
  { pattern: /flask/i, name: 'Flask' },
  { pattern: /starlette/i, name: 'Starlette' },
  { pattern: /tornado/i, name: 'Tornado' },
  { pattern: /aiohttp/i, name: 'aiohttp' },
  { pattern: /sqlalchemy/i, name: 'SQLAlchemy' },
  { pattern: /alembic/i, name: 'Alembic' },
  { pattern: /celery/i, name: 'Celery' },
  { pattern: /pytest/i, name: 'pytest' },
  { pattern: /pydantic/i, name: 'Pydantic' },
];

async function detectPythonFrameworks(directory: string): Promise<string[]> {
  const sources = [
    join(directory, 'requirements.txt'),
    join(directory, 'requirements-dev.txt'),
    join(directory, 'pyproject.toml'),
    join(directory, 'setup.cfg'),
    join(directory, 'Pipfile'),
  ];

  const contents = await Promise.all(
    sources.map(p => readFile(p, 'utf8').catch(() => '')),
  );
  const combined = contents.join('\n');
  if (!combined.trim()) return [];

  return PYTHON_FRAMEWORK_RULES
    .filter(rule => rule.pattern.test(combined))
    .map(rule => rule.name);
}

// ── Go ────────────────────────────────────────────────────────────────────────

const GO_FRAMEWORK_RULES: PatternRule[] = [
  { pattern: /github\.com\/gin-gonic\/gin/i, name: 'Gin' },
  { pattern: /github\.com\/labstack\/echo/i, name: 'Echo' },
  { pattern: /github\.com\/gofiber\/fiber/i, name: 'Fiber' },
  { pattern: /github\.com\/gorilla\/mux/i, name: 'Gorilla Mux' },
  { pattern: /github\.com\/go-chi\/chi/i, name: 'Chi' },
  { pattern: /github\.com\/beego\/beego/i, name: 'Beego' },
  { pattern: /gorm\.io\/gorm/i, name: 'GORM' },
  { pattern: /github\.com\/google\/wire/i, name: 'Wire' },
  { pattern: /go\.uber\.org\/zap/i, name: 'Zap' },
];

async function detectGoFrameworks(directory: string): Promise<string[]> {
  let content: string;
  try {
    content = await readFile(join(directory, 'go.mod'), 'utf8');
  } catch {
    return [];
  }

  return GO_FRAMEWORK_RULES
    .filter(rule => rule.pattern.test(content))
    .map(rule => rule.name);
}

// ── Rust ──────────────────────────────────────────────────────────────────────

const RUST_FRAMEWORK_RULES: PatternRule[] = [
  { pattern: /actix-web/i, name: 'Actix Web' },
  { pattern: /axum/i, name: 'Axum' },
  { pattern: /rocket/i, name: 'Rocket' },
  { pattern: /warp/i, name: 'Warp' },
  { pattern: /tokio/i, name: 'Tokio' },
  { pattern: /diesel/i, name: 'Diesel' },
  { pattern: /sea-orm/i, name: 'SeaORM' },
  { pattern: /sqlx/i, name: 'SQLx' },
  { pattern: /serde/i, name: 'Serde' },
];

async function detectRustFrameworks(directory: string): Promise<string[]> {
  let content: string;
  try {
    content = await readFile(join(directory, 'Cargo.toml'), 'utf8');
  } catch {
    return [];
  }

  return RUST_FRAMEWORK_RULES
    .filter(rule => rule.pattern.test(content))
    .map(rule => rule.name);
}

// ── JVM (Java / Kotlin / Scala) ───────────────────────────────────────────────

const JVM_FRAMEWORK_RULES: PatternRule[] = [
  { pattern: /spring-boot/i, name: 'Spring Boot' },
  { pattern: /spring-web/i, name: 'Spring MVC' },
  { pattern: /quarkus/i, name: 'Quarkus' },
  { pattern: /micronaut/i, name: 'Micronaut' },
  { pattern: /ktor/i, name: 'Ktor' },
  { pattern: /hibernate/i, name: 'Hibernate' },
  { pattern: /mybatis/i, name: 'MyBatis' },
  { pattern: /junit/i, name: 'JUnit' },
];

async function detectJvmFrameworks(directory: string): Promise<string[]> {
  const sources = [
    join(directory, 'pom.xml'),
    join(directory, 'build.gradle'),
    join(directory, 'build.gradle.kts'),
  ];

  const contents = await Promise.all(
    sources.map(p => readFile(p, 'utf8').catch(() => '')),
  );
  const combined = contents.join('\n');
  if (!combined.trim()) return [];

  return JVM_FRAMEWORK_RULES
    .filter(rule => rule.pattern.test(combined))
    .map(rule => rule.name);
}

// ── Ruby ──────────────────────────────────────────────────────────────────────

const RUBY_FRAMEWORK_RULES: PatternRule[] = [
  { pattern: /rails/i, name: 'Ruby on Rails' },
  { pattern: /sinatra/i, name: 'Sinatra' },
  { pattern: /hanami/i, name: 'Hanami' },
  { pattern: /rspec/i, name: 'RSpec' },
  { pattern: /sidekiq/i, name: 'Sidekiq' },
];

async function detectRubyFrameworks(directory: string): Promise<string[]> {
  let content: string;
  try {
    content = await readFile(join(directory, 'Gemfile'), 'utf8');
  } catch {
    return [];
  }

  return RUBY_FRAMEWORK_RULES
    .filter(rule => rule.pattern.test(content))
    .map(rule => rule.name);
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function detectFrameworks(directory: string): Promise<FrameworkMap> {
  const [javascript, python, go, rust, jvm, ruby] = await Promise.all([
    detectJsFrameworks(directory),
    detectPythonFrameworks(directory),
    detectGoFrameworks(directory),
    detectRustFrameworks(directory),
    detectJvmFrameworks(directory),
    detectRubyFrameworks(directory),
  ]);

  const result: FrameworkMap = {};
  if (javascript.length > 0) result['javascript'] = javascript;
  if (python.length > 0) result['python'] = python;
  if (go.length > 0) result['go'] = go;
  if (rust.length > 0) result['rust'] = rust;
  if (jvm.length > 0) result['jvm'] = jvm;
  if (ruby.length > 0) result['ruby'] = ruby;

  return result;
}
