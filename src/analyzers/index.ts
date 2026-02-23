import { detectLanguages } from './language-detector.js';
import { detectFrameworks } from './framework-detector.js';
import { analyzeFolders } from './folder-analyzer.js';
import type { RepositoryProfile } from '../types.js';

export type { RepositoryProfile };

function errorMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason);
}

export async function analyzeRepository(directory: string): Promise<RepositoryProfile> {
  const errors: string[] = [];

  const [languagesResult, frameworksResult, foldersResult] = await Promise.allSettled([
    detectLanguages(directory),
    detectFrameworks(directory),
    analyzeFolders(directory),
  ]);

  const languages =
    languagesResult.status === 'fulfilled'
      ? languagesResult.value
      : (() => {
          errors.push(`Language detection failed: ${errorMessage(languagesResult.reason)}`);
          return {};
        })();

  const frameworks =
    frameworksResult.status === 'fulfilled'
      ? frameworksResult.value
      : (() => {
          errors.push(`Framework detection failed: ${errorMessage(frameworksResult.reason)}`);
          return {};
        })();

  const folders =
    foldersResult.status === 'fulfilled'
      ? foldersResult.value
      : (() => {
          errors.push(`Folder analysis failed: ${errorMessage(foldersResult.reason)}`);
          return [];
        })();

  return { languages, frameworks, folders, errors };
}
