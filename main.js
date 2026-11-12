// wen-alma is a skills-only plugin. Alma's plugin system and its skills
// system are separate: plugin installation alone does not register skills.
// On activate we symlink each skills/<name> directory into the personal
// skills folder (~/.config/alma/skills), which the skills scanner reads
// (it follows symlinked directories). Deactivate removes only our links.
//
// The installed plugin path (~/.config/alma/plugins/wen-alma) is stable, so
// a plugin update re-points nothing: the symlinks keep tracking the new
// skill files automatically.

import { mkdirSync, readdirSync, readlinkSync, rmSync, symlinkSync, existsSync, lstatSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
const SKILLS_SRC = join(PLUGIN_ROOT, "skills");
const PERSONAL_SKILLS = join(homedir(), ".config", "alma", "skills");

function linkTargetsOurPlugin(linkPath) {
  try {
    return readlinkSync(linkPath).startsWith(SKILLS_SRC);
  } catch {
    return false;
  }
}

export async function activate() {
  if (!existsSync(SKILLS_SRC)) return;

  mkdirSync(PERSONAL_SKILLS, { recursive: true });

  for (const name of readdirSync(SKILLS_SRC, { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    const src = join(SKILLS_SRC, name.name);
    const dest = join(PERSONAL_SKILLS, name.name);

    let existing = null;
    try {
      existing = lstatSync(dest);
    } catch {
      // not present
    }

    if (existing?.isSymbolicLink()) {
      if (linkTargetsOurPlugin(dest)) {
        rmSync(dest); // refresh link (plugin path is stable, but be safe)
      } else {
        console.warn(`[wen-alma] skill '${name.name}' exists as another symlink; skipping`);
        continue;
      }
    } else if (existing) {
      console.warn(`[wen-alma] skill '${name.name}' already exists in personal skills; skipping`);
      continue;
    }

    symlinkSync(src, dest, "dir");
    console.log(`[wen-alma] linked skill '${name.name}' -> ${src}`);
  }
}

export async function deactivate() {
  if (!existsSync(PERSONAL_SKILLS)) return;
  for (const name of readdirSync(PERSONAL_SKILLS, { withFileTypes: true })) {
    const dest = join(PERSONAL_SKILLS, name.name);
    if (name.isSymbolicLink() && linkTargetsOurPlugin(dest)) {
      rmSync(dest);
      console.log(`[wen-alma] unlinked skill '${name.name}'`);
    }
  }
}
