import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import type { UserInput, PathInstruction } from '../types.js';

/** Directory-based exclusions: only added when the directory exists. */
const DIRECTORY_EXCLUSIONS: string[] = [
  'node_modules',
  '.git',
  'vendor',
  'dist',
  'build',
  '.next',
  '.nuxt',
  'coverage',
  'target',
  'out',
  '.cache',
  '__pycache__',
];

/** File exclusions: only added when the file exists. */
const FILE_EXCLUSIONS: string[] = [
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function buildPathFilters(rootDirectory: string): Promise<string[]> {
  const [dirChecks, fileChecks] = await Promise.all([
    Promise.all(
      DIRECTORY_EXCLUSIONS.map(async dir => ({
        filter: `!${dir}/**`,
        exists: await exists(join(rootDirectory, dir)),
      })),
    ),
    Promise.all(
      FILE_EXCLUSIONS.map(async file => ({
        filter: `!${file}`,
        exists: await exists(join(rootDirectory, file)),
      })),
    ),
  ]);

  return [
    ...dirChecks.filter(c => c.exists).map(c => c.filter),
    ...fileChecks.filter(c => c.exists).map(c => c.filter),
  ];
}

export interface CodeRabbitConfig {
  language: string;
  early_access: boolean;
  reviews: {
    profile: string;
    request_changes_workflow: boolean;
    high_level_summary: boolean;
    poem: boolean;
    review_status: boolean;
    collapse_walkthrough: boolean;
    path_filters: string[];
    path_instructions?: PathInstruction[];
  };
}

export async function generateConfig(
  userInput: UserInput,
  pathInstructions: PathInstruction[],
  rootDirectory: string,
): Promise<CodeRabbitConfig> {
  const pathFilters = await buildPathFilters(rootDirectory);

  return {
    language: userInput.language,
    early_access: userInput.earlyAccess,
    reviews: {
      profile: userInput.reviewProfile,
      request_changes_workflow: false,
      high_level_summary: true,
      poem: false,
      review_status: true,
      collapse_walkthrough: false,
      path_filters: pathFilters,
      ...(pathInstructions.length > 0 && { path_instructions: pathInstructions }),
    },
  };
}
