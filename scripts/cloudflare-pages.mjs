import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const openNextDir = path.join(rootDir, '.open-next');
const assetsDir = path.join(openNextDir, 'assets');

/**
 * cloudflare-pages.mjs
 * 
 * Finalises the OpenNext build for Cloudflare Pages (Advanced Mode).
 * 1. Moves static assets to the root of .open-next
 * 2. Renames worker.js to _worker.js
 * 3. Resolves symlinks (crucial for pnpm projects where links point outside the build dir)
 */

// 1. Move everything out of .open-next/assets/ to the root of .open-next/
if (fs.existsSync(assetsDir)) {
  console.log('📦 Moving assets to root...');
  const files = fs.readdirSync(assetsDir);
  for (const file of files) {
    const src = path.join(assetsDir, file);
    const dest = path.join(openNextDir, file);
    
    // Avoid overwriting worker files
    if (file === 'worker.js' || file === '_worker.js') continue;
    
    // If destination already exists, remove it first (pnpm might have created it)
    if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
    }
    fs.renameSync(src, dest);
  }
  fs.rmSync(assetsDir, { recursive: true, force: true });
}

// 2. Rename worker.js to _worker.js
const workerFile = path.join(openNextDir, 'worker.js');
const targetWorkerFile = path.join(openNextDir, '_worker.js');
if (fs.existsSync(workerFile)) {
  console.log('⚙️ Renaming worker.js to _worker.js...');
  fs.renameSync(workerFile, targetWorkerFile);
}

// 3. Resolve symlinks (Cloudflare Pages fails on links pointing outside the build dir)
function resolveSymlinks(currentDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    
    if (entry.isSymbolicLink()) {
      const target = fs.readlinkSync(fullPath);
      const absTarget = path.resolve(currentDir, target);
      
      // If the link points outside of .open-next, copy the content instead
      if (!absTarget.startsWith(openNextDir)) {
        console.log(`🔗 Resolving symlink: ${path.relative(openNextDir, fullPath)}`);
        const stats = fs.statSync(fullPath);
        fs.unlinkSync(fullPath);
        
        if (stats.isDirectory()) {
          fs.cpSync(absTarget, fullPath, { recursive: true, dereference: true });
        } else {
          fs.copyFileSync(absTarget, fullPath);
        }
      }
    } else if (entry.isDirectory()) {
      resolveSymlinks(fullPath);
    }
  }
}

console.log('🔍 Identifying and resolving external symlinks...');
resolveSymlinks(openNextDir);

console.log('✅ Adapted .open-next for Cloudflare Pages native Advanced Mode.');

