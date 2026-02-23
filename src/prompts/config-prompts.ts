import inquirer from 'inquirer';
import type { RepositoryProfile, DetectedFolder, FolderConfig, UserInput } from '../types.js';
import type { ExistingConfig } from '../loaders/existing-config-loader.js';
import { findExistingInstruction } from '../loaders/existing-config-loader.js';

interface InitOptions {
  output: string;
  interactive: boolean;
}

const LANGUAGE_CHOICES = [
  { name: '日本語 (ja-JP)', value: 'ja-JP' },
  { name: 'English (en-US)', value: 'en-US' },
  { name: '中文 (zh-CN)', value: 'zh-CN' },
  { name: '한국어 (ko-KR)', value: 'ko-KR' },
  { name: 'Français (fr-FR)', value: 'fr-FR' },
  { name: 'Deutsch (de-DE)', value: 'de-DE' },
  { name: 'Español (es-ES)', value: 'es-ES' },
];

const ROLE_LABEL: Record<string, string> = {
  api: 'API/Backend',
  frontend: 'Frontend',
  documentation: 'Documentation',
  tests: 'Tests',
  configuration: 'Configuration',
  infrastructure: 'Infrastructure',
};

function folderSummary(folder: DetectedFolder): string {
  const role = ROLE_LABEL[folder.role] ?? folder.role;
  const allFrameworks = Object.values(folder.frameworks).flat();
  const fw = allFrameworks.length > 0 ? ` [${allFrameworks.join(', ')}]` : '';
  return `${folder.path}/${fw} (${role})`;
}

export function buildDefaults(
  profile: RepositoryProfile,
  existing: ExistingConfig | null,
): UserInput {
  return {
    language: existing?.language ?? 'en-US',
    earlyAccess: existing?.early_access ?? false,
    reviewProfile: (existing?.reviews?.profile as UserInput['reviewProfile']) ?? 'chill',
    folders: profile.folders.map(folder => ({
      ...folder,
      instruction: existing ? (findExistingInstruction(existing, folder.path) ?? '') : '',
      enabled: true,
    })),
  };
}

export async function collectUserInput(
  profile: RepositoryProfile,
  options: InitOptions,
  existing: ExistingConfig | null,
): Promise<UserInput> {
  if (!options.interactive || !process.stdout.isTTY) {
    return buildDefaults(profile, existing);
  }

  // ── Step 1: global settings ──────────────────────────────────────────────
  const global = await inquirer.prompt<{
    language: string;
    reviewProfile: 'chill' | 'assertive';
    earlyAccess: boolean;
  }>([
    {
      type: 'list',
      name: 'language',
      message: 'Review language:',
      choices: LANGUAGE_CHOICES,
      default: existing?.language ?? 'en-US',
    },
    {
      type: 'list',
      name: 'reviewProfile',
      message: 'Review profile:',
      choices: [
        { name: 'chill  – constructive, non-blocking comments', value: 'chill' },
        { name: 'assertive – stricter, may request changes', value: 'assertive' },
      ],
      default: existing?.reviews?.profile ?? 'chill',
    },
    {
      type: 'confirm',
      name: 'earlyAccess',
      message: 'Enable early_access features?',
      default: existing?.early_access ?? false,
    },
  ]);

  // ── Step 2: per-folder confirmation and customization ────────────────────
  const folders: FolderConfig[] = [];

  for (const folder of profile.folders) {
    const summary = folderSummary(folder);
    const existingInstruction = existing
      ? findExistingInstruction(existing, folder.path)
      : undefined;

    const { enabled } = await inquirer.prompt<{ enabled: boolean }>([
      {
        type: 'confirm',
        name: 'enabled',
        message: `Include folder  ${summary}?`,
        default: true,
      },
    ]);

    if (!enabled) {
      folders.push({ ...folder, instruction: '', enabled: false });
      continue;
    }

    // If the existing config already has a custom instruction for this folder,
    // default to 'custom' mode and pre-fill it.
    const defaultMode = existingInstruction ? 'custom' : 'preset';

    const { instructionMode } = await inquirer.prompt<{ instructionMode: 'preset' | 'custom' | 'none' }>([
      {
        type: 'list',
        name: 'instructionMode',
        message: `  Review instructions for ${folder.path}/:`,
        choices: [
          { name: 'Use default preset', value: 'preset' },
          { name: 'Enter custom instruction', value: 'custom' },
          { name: 'No instruction', value: 'none' },
        ],
        default: defaultMode,
      },
    ]);

    let instruction = '';
    if (instructionMode === 'custom') {
      const { customInstruction } = await inquirer.prompt<{ customInstruction: string }>([
        {
          type: 'input',
          name: 'customInstruction',
          message: '  Custom instruction:',
          default: existingInstruction ?? '',
          validate: (v: string) => v.trim().length > 0 || 'Please enter an instruction.',
        },
      ]);
      instruction = customInstruction.trim();
    }

    folders.push({ ...folder, instruction, enabled: true });
  }

  return {
    language: global.language,
    earlyAccess: global.earlyAccess,
    reviewProfile: global.reviewProfile,
    folders,
  };
}
