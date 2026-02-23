// ── Language detection ────────────────────────────────────────────────────────

/** Language name → usage percentage (0–100) */
export type LanguageDistribution = Record<string, number>;

// ── Framework detection ───────────────────────────────────────────────────────

/** Ecosystem name → list of detected frameworks/libraries */
export type FrameworkMap = Record<string, string[]>;

// ── Folder analysis ───────────────────────────────────────────────────────────

export type FolderRole =
  | 'api'
  | 'frontend'
  | 'documentation'
  | 'tests'
  | 'configuration'
  | 'infrastructure';

export interface DetectedFolder {
  path: string;
  role: FolderRole;
  frameworks: FrameworkMap;
}

// ── Repository profile ────────────────────────────────────────────────────────

export interface RepositoryProfile {
  languages: LanguageDistribution;
  frameworks: FrameworkMap;
  folders: DetectedFolder[];
  errors: string[];
}

// ── User input ────────────────────────────────────────────────────────────────

export interface FolderConfig extends DetectedFolder {
  instruction: string;
  enabled: boolean;
}

export interface UserInput {
  language: string;
  earlyAccess: boolean;
  reviewProfile: 'chill' | 'assertive';
  folders: FolderConfig[];
}

// ── Generators ────────────────────────────────────────────────────────────────

export interface PathInstruction {
  path: string;
  instructions: string;
}
