import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const openNextDir = path.join(rootDir, '.open-next');
const assetsDir = path.join(openNextDir, 'assets');

// 1. Move everything out of .open-next/assets/ to the root of .open-next/
if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  for (const file of files) {
    const src = path.join(assetsDir, file);
    const dest = path.join(openNextDir, file);
    fs.renameSync(src, dest);
  }
  // Safely remove the now-empty assets directory
  fs.rmdirSync(assetsDir);
}

// 2. Rename worker.js to _worker.js so Cloudflare Pages recognizes it
const workerFile = path.join(openNextDir, 'worker.js');
const targetWorkerFile = path.join(openNextDir, '_worker.js');
if (fs.existsSync(workerFile)) {
  fs.renameSync(workerFile, targetWorkerFile);
}

console.log('✅ Adapted .open-next for Cloudflare Pages native Advanced Mode.');
