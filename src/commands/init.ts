import { resolve } from 'node:path';
import { analyzeRepository } from '../analyzers/index.js';
import { collectUserInput } from '../prompts/config-prompts.js';
import { generatePathInstructions } from '../generators/path-instructions-generator.js';
import { generateConfig } from '../generators/config-generator.js';
import { writeYaml, printSummary } from '../generators/yaml-writer.js';
import { loadExistingConfig } from '../loaders/existing-config-loader.js';
import type { RepositoryProfile } from '../types.js';

// ── Lightweight spinner ───────────────────────────────────────────────────────

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

interface Spinner {
  succeed(msg: string): void;
  fail(msg: string): void;
}

function createSpinner(text: string): Spinner {
  if (!process.stdout.isTTY) {
    process.stdout.write(text + '...\n');
    return {
      succeed(msg) { process.stdout.write('✓ ' + msg + '\n'); },
      fail(msg) { process.stderr.write('✗ ' + msg + '\n'); },
    };
  }

  let i = 0;
  const timer = setInterval(() => {
    process.stdout.write('\r' + SPINNER_FRAMES[i++ % SPINNER_FRAMES.length] + ' ' + text);
  }, 80);

  return {
    succeed(msg) {
      clearInterval(timer);
      process.stdout.write('\r✓ ' + msg + '\n');
    },
    fail(msg) {
      clearInterval(timer);
      process.stdout.write('\r✗ ' + msg + '\n');
    },
  };
}

// ── Analysis result display ───────────────────────────────────────────────────

function printProfile(profile: RepositoryProfile): void {
  console.log('');
  console.log('── Analysis Results ─────────────────────────────────────────');

  const langEntries = Object.entries(profile.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  if (langEntries.length > 0) {
    console.log('  Languages:');
    for (const [lang, pct] of langEntries) {
      console.log(`    ${lang.padEnd(20)} ${pct.toFixed(1)}%`);
    }
  }

  const ecosystems = Object.entries(profile.frameworks);
  if (ecosystems.length > 0) {
    console.log('  Frameworks:');
    for (const [eco, fws] of ecosystems) {
      console.log(`    ${eco}: ${fws.join(', ')}`);
    }
  }

  if (profile.folders.length > 0) {
    console.log('  Detected folders:');
    for (const f of profile.folders) {
      const allFws = Object.values(f.frameworks).flat();
      const fw = allFws.length > 0 ? ` [${allFws.join(', ')}]` : '';
      console.log(`    ${f.path}/${fw} → ${f.role}`);
    }
  }

  if (profile.errors.length > 0) {
    console.log('  Warnings:');
    for (const err of profile.errors) {
      console.log(`    ! ${err}`);
    }
  }

  console.log('─────────────────────────────────────────────────────────────');
  console.log('');
}

// ── Main command handler ──────────────────────────────────────────────────────

interface InitOptions {
  output: string;
  interactive: boolean;
}

export async function init(options: InitOptions): Promise<void> {
  const cwd = resolve(process.cwd());

  // ── Step 1: Analyze ───────────────────────────────────────────────────────
  const spinner = createSpinner('Analyzing repository');
  let profile: RepositoryProfile;
  try {
    profile = await analyzeRepository(cwd);
    spinner.succeed('Repository analyzed');
  } catch (err) {
    spinner.fail('Analysis failed: ' + (err instanceof Error ? err.message : String(err)));
    process.exitCode = 1;
    return;
  }

  printProfile(profile);

  // ── Step 2: Collect user input ────────────────────────────────────────────
  const existing = await loadExistingConfig(resolve(options.output));

  let userInput;
  try {
    userInput = await collectUserInput(profile, options, existing);
  } catch (err) {
    console.error('✗ Prompt failed: ' + (err instanceof Error ? err.message : String(err)));
    process.exitCode = 1;
    return;
  }

  // ── Step 3: Generate configuration ───────────────────────────────────────
  const pathInstructions = generatePathInstructions(userInput.folders);
  const config = await generateConfig(userInput, pathInstructions, cwd);

  // ── Step 4: Write YAML ────────────────────────────────────────────────────
  let result;
  try {
    result = await writeYaml(config, options.output);
  } catch (err) {
    console.error('✗ Write failed: ' + (err instanceof Error ? err.message : String(err)));
    process.exitCode = 1;
    return;
  }

  if (!result.written) {
    console.log('Aborted. No file was written.');
    return;
  }

  printSummary(config, result.filePath);
}
