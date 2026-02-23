import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';

export interface ExistingConfig {
  language?: string;
  early_access?: boolean;
  reviews?: {
    profile?: string;
    path_instructions?: Array<{ path: string; instructions: string }>;
  };
}

/**
 * Read and parse an existing .coderabbit.yaml.
 * Returns null if the file does not exist or cannot be parsed.
 */
export async function loadExistingConfig(filePath: string): Promise<ExistingConfig | null> {
  let raw: string;
  try {
    raw = await readFile(filePath, 'utf8');
  } catch {
    return null;
  }

  try {
    const parsed = parse(raw);
    if (parsed === null || typeof parsed !== 'object') return null;
    return parsed as ExistingConfig;
  } catch {
    return null;
  }
}

/**
 * Find a matching path_instruction for a folder path (e.g. "api" → "api/**").
 */
export function findExistingInstruction(
  existingConfig: ExistingConfig,
  folderPath: string,
): string | undefined {
  const instructions = existingConfig.reviews?.path_instructions;
  if (!instructions) return undefined;

  const target = `${folderPath}/**`;
  return instructions.find(pi => pi.path === target)?.instructions;
}
