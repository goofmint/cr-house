import type { FolderRole, FolderConfig, PathInstruction } from '../types.js';

// ── Role-level default templates ──────────────────────────────────────────────

const ROLE_TEMPLATES: Record<FolderRole, string> = {
  api: 'Focus on API endpoint security, error handling, and response format consistency. Check for proper input validation, authentication/authorization, and appropriate HTTP status codes.',
  frontend: 'Focus on component reusability, accessibility (ARIA attributes, keyboard navigation), and performance (avoid unnecessary re-renders, lazy loading).',
  documentation: 'Verify accuracy and clarity. Check that docs are up to date with the current code and that examples are correct.',
  tests: 'Verify test coverage, edge cases, and test readability. Ensure tests are deterministic and isolated.',
  configuration: 'Check for hardcoded secrets or credentials, validate environment variable usage, and ensure configs follow the principle of least privilege.',
  infrastructure: 'Review security posture, resource sizing, and cost implications. Verify idempotency of IaC changes and proper state management.',
};

// ── Framework-specific addendum ───────────────────────────────────────────────

const FRAMEWORK_ADDENDA: Record<string, string> = {
  'React': 'Verify hooks rules (exhaustive deps, no hooks in conditionals). Prefer controlled components and avoid prop drilling by using context or state management.',
  'Next.js': 'Distinguish Server Components from Client Components. Verify correct use of data fetching patterns (Server Actions, Route Handlers) and metadata APIs.',
  'Vue.js': "Check Composition API usage (reactivity pitfalls with `reactive` vs `ref`). Ensure proper component lifecycle management.",
  'Angular': 'Check for proper use of dependency injection, OnPush change detection, and async pipe usage to avoid memory leaks.',
  'Svelte': 'Verify reactive declarations ($:) and store subscriptions are cleaned up properly.',
  'Nuxt.js': 'Validate use of `useAsyncData`, `useFetch`, and server-side rendering considerations.',
  'SolidJS': 'Ensure reactive primitives (signals, memos) are used correctly and DOM access is avoided outside of `onMount`.',
  'Django': 'Apply Django security best practices: CSRF protection, SQL injection prevention via ORM, XSS prevention in templates, and proper use of `settings.SECRET_KEY`.',
  'FastAPI': 'Verify Pydantic schema correctness, dependency injection patterns, and proper async endpoint design.',
  'Flask': 'Check for proper use of application context, blueprint organisation, and avoid hardcoded configuration.',
  'Express': 'Verify middleware order, proper error-handling middleware (4-argument), and avoid synchronous blocking calls.',
  'NestJS': 'Check module encapsulation, proper DTO validation with class-validator, and Guard/Interceptor patterns.',
  'Fastify': 'Validate schema-based request/response validation and plugin encapsulation.',
  'Gin': 'Verify proper binding and validation of request payloads, context cancellation handling, and middleware usage.',
  'Echo': 'Check request binding, middleware registration order, and proper error handling.',
  'Axum': 'Verify extractor usage, error types implement `IntoResponse`, and handler functions are properly typed.',
  'Actix Web': 'Check `Data<T>` usage for shared state, proper async actor patterns, and avoid blocking operations in handlers.',
  'Spring Boot': 'Verify proper use of `@Transactional`, `@Valid` for request validation, and Spring Security configurations.',
  'Prisma': 'Check for N+1 query issues, use of transactions where needed, and proper error handling on Prisma Client operations.',
  'TypeORM': 'Verify entity relationships, lazy/eager loading strategy, and migration consistency.',
  'GORM': 'Watch for N+1 queries; prefer `Preload` or `Joins`. Validate error handling after each GORM call.',
  'GraphQL': 'Check resolver efficiency (DataLoader for batching), input validation, and avoid over-fetching in nested resolvers.',
};

function buildInstruction(folderConfig: FolderConfig): string {
  if (folderConfig.instruction) {
    return folderConfig.instruction;
  }

  const base = ROLE_TEMPLATES[folderConfig.role] ?? '';
  const allFrameworks = Object.values(folderConfig.frameworks).flat();
  const addenda = allFrameworks
    .map(fw => FRAMEWORK_ADDENDA[fw])
    .filter((s): s is string => s !== undefined);

  return addenda.length > 0 ? `${base}\n${addenda.join('\n')}` : base;
}

export function generatePathInstructions(folders: FolderConfig[]): PathInstruction[] {
  return folders
    .filter(f => f.enabled)
    .map(f => ({
      path: `${f.path}/**`,
      instructions: buildInstruction(f),
    }))
    .filter(pi => pi.instructions.length > 0);
}
