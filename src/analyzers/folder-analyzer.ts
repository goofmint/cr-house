import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { detectFrameworks } from './framework-detector.js';
import type { FolderRole, DetectedFolder } from '../types.js';

interface FolderPattern {
  candidates: string[];
  role: FolderRole;
}

const FOLDER_PATTERNS: FolderPattern[] = [
  {
    candidates: ['api', 'backend', 'server', 'src/api', 'app/api', 'apps/api', 'apps/server'],
    role: 'api',
  },
  {
    candidates: ['frontend', 'client', 'web', 'ui', 'src/components', 'src/pages', 'apps/web', 'apps/client'],
    role: 'frontend',
  },
  {
    candidates: ['docs', 'documentation', 'doc'],
    role: 'documentation',
  },
  {
    candidates: ['test', 'tests', '__tests__', 'spec', 'specs', 'e2e'],
    role: 'tests',
  },
  {
    candidates: ['config', '.github', '.gitlab'],
    role: 'configuration',
  },
  {
    candidates: ['infra', 'infrastructure', 'terraform', 'k8s', 'kubernetes', 'helm', 'deploy', 'deployment'],
    role: 'infrastructure',
  },
];

async function isDirectory(path: string): Promise<boolean> {
  try {
    const s = await stat(path);
    return s.isDirectory();
  } catch {
    return false;
  }
}

export async function analyzeFolders(rootDirectory: string): Promise<DetectedFolder[]> {
  const detected: DetectedFolder[] = [];

  await Promise.all(
    FOLDER_PATTERNS.map(async ({ candidates, role }) => {
      for (const candidate of candidates) {
        const fullPath = join(rootDirectory, candidate);
        if (await isDirectory(fullPath)) {
          const frameworks = await detectFrameworks(fullPath);
          detected.push({ path: candidate, role, frameworks });
          break;
        }
      }
    }),
  );

  return detected.sort((a, b) => a.path.localeCompare(b.path));
}
