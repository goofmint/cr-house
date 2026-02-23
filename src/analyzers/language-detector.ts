import linguist from 'linguist-js';
import type { LanguageDistribution } from '../types.js';

const IGNORED_PATTERNS = [
  'node_modules/**',
  '.git/**',
  'vendor/**',
  'vendors/**',
  '.venv/**',
  'venv/**',
  '__pycache__/**',
  'dist/**',
  'build/**',
  '.next/**',
  '.nuxt/**',
  'coverage/**',
  '.cache/**',
  'target/**',
  'out/**',
];

export async function detectLanguages(directory: string): Promise<LanguageDistribution> {
  const { languages } = await linguist(directory, {
    ignoredFiles: IGNORED_PATTERNS,
    keepVendored: false,
    keepBinary: false,
    categories: ['programming', 'markup', 'data', 'prose'],
    offline: true,
  });

  const totalBytes = languages.bytes;
  if (totalBytes === 0) {
    return {};
  }

  const distribution: LanguageDistribution = {};
  for (const [name, info] of Object.entries(languages.results)) {
    const percentage = (info.bytes / totalBytes) * 100;
    distribution[name] = Math.round(percentage * 10) / 10;
  }

  return distribution;
}
