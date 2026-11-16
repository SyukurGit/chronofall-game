// Chronofall: Aegis of the Clockwork Citadel
// Custom Node.js 22 entrypoint for make.fun best-game-01 competition
// Bundles offline static web assets, 4-shot visual portfolio, and constructs dossier.json

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const rootPath = fileURLToPath(new URL('.', import.meta.url));
const destPath = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

console.log('[Chronofall] Initializing build pipeline...');
console.log(`[Chronofall] Root directory: ${rootPath}`);
console.log(`[Chronofall] Destination: ${destPath}`);

mkdirSync(destPath, { recursive: true });

// Stage 1: Transfer game client static bundle
const sourceGame = join(rootPath, 'game');
const targetGame = join(destPath, 'game');
cpSync(sourceGame, targetGame, { recursive: true });
console.log('[Chronofall] Staged static game runtime successfully.');

// Stage 2: Transfer 4-shot visual portfolio
const sourceScreens = join(rootPath, 'screenshots');
const targetScreens = join(destPath, 'screenshots');
mkdirSync(targetScreens, { recursive: true });

if (existsSync(sourceScreens)) {
  cpSync(sourceScreens, targetScreens, { recursive: true });
  console.log('[Chronofall] Staged 4-shot gameplay portfolio.');
} else {
  console.warn('[Chronofall] Notice: Screenshots directory not present.');
}

// Stage 3: Synthesize judge dossier within strict competitive gate limits
const dossierManifest = buildDossier(destPath, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});

const targetDossier = join(destPath, 'dossier.json');
writeFileSync(targetDossier, dossierManifest);

console.log(`[Chronofall] Dossier created: ${dossierManifest.length} bytes.`);
console.log('[Chronofall] Build distribution finalized and verified.');
