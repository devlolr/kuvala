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

// 3. Resolve ALL symlinks (Cloudflare Pages fails on links)
const realOpenNextDir = fs.realpathSync(openNextDir);

function resolveSymlinks(currentDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    
    // Check if it's a symbolic link using lstat (don't follow yet)
    const lstats = fs.lstatSync(fullPath);
    
    if (lstats.isSymbolicLink()) {
      console.log(`🔗 Resolving symlink: ${path.relative(realOpenNextDir, fullPath)}`);
      
      const target = fs.readlinkSync(fullPath);
      const absTarget = path.resolve(currentDir, target);
      
      if (!fs.existsSync(absTarget)) {
        console.warn(`⚠️ Found broken symlink: ${fullPath} -> ${absTarget}. Removing.`);
        fs.unlinkSync(fullPath);
        continue;
      }

      const stats = fs.statSync(fullPath); // Follows link to target
      fs.unlinkSync(fullPath);
      
      if (stats.isDirectory()) {
        fs.cpSync(absTarget, fullPath, { recursive: true, dereference: true });
        // Recurse into the newly copied directory to resolve any links within it
        resolveSymlinks(fullPath);
      } else {
        fs.copyFileSync(absTarget, fullPath);
      }
    } else if (entry.isDirectory()) {
      resolveSymlinks(fullPath);
    }
  }
}

console.log('🔍 Identifying and resolving all symlinks...');
try {
  resolveSymlinks(realOpenNextDir);
} catch (err) {
  console.error('❌ Error during symlink resolution:', err.message);
}

console.log('✅ Adapted .open-next for Cloudflare Pages native Advanced Mode.');



