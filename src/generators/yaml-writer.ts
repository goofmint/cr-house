import { writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { stringify } from 'yaml';
import inquirer from 'inquirer';
import type { CodeRabbitConfig } from './config-generator.js';

const SCHEMA_COMMENT =
  '# yaml-language-server: $schema=https://coderabbit.ai/integrations/schema.v2.json\n';

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await readFile(filePath);
    return true;
  } catch {
    return false;
  }
}

export function configToYaml(config: CodeRabbitConfig): string {
  const body = stringify(config, {
    lineWidth: 0,
    defaultStringType: 'QUOTE_DOUBLE',
    defaultKeyType: 'PLAIN',
  });
  return SCHEMA_COMMENT + body;
}

export async function writeYaml(
  config: CodeRabbitConfig,
  outputPath: string,
): Promise<{ written: boolean; filePath: string }> {
  const filePath = resolve(outputPath);
  const exists = await fileExists(filePath);

  if (exists && process.stdout.isTTY) {
    const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `${outputPath} already exists. Overwrite?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      return { written: false, filePath };
    }
  }

  await writeFile(filePath, configToYaml(config), 'utf8');
  return { written: true, filePath };
}

export function printSummary(config: CodeRabbitConfig, filePath: string): void {
  const pathInstructions = config.reviews.path_instructions ?? [];

  console.log('');
  console.log('✓ Written: ' + filePath);
  console.log('');
  console.log('  language     : ' + config.language);
  console.log('  profile      : ' + config.reviews.profile);
  console.log('  early_access : ' + String(config.early_access));
  if (pathInstructions.length > 0) {
    console.log('  path_instructions:');
    for (const pi of pathInstructions) {
      console.log('    - ' + pi.path);
    }
  }
  console.log('');
}
