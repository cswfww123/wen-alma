// wen-alma is a skills-only plugin. Alma's plugin system (manifest.json +
// main.js, tools/commands via PluginContext) and its skills system
// (~/.config/alma/skills, bundled, claude-code) are separate: plugin
// installation alone does not register skills, and PluginContext has no
// skills API. On activate we therefore symlink each skills/<name> directory
// into the personal skills folder — the skills scanner follows symlinked
// directories. dispose removes only links that point back into this plugin.
//
// The installed plugin path (~/.config/alma/plugins/wen-alma) is stable, so
// plugin updates need no re-pointing: links keep tracking the new files.

import { mkdirSync, readdirSync, readlinkSync, rmSync, symlinkSync, existsSync, lstatSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
const SKILLS_SRC = join(PLUGIN_ROOT, "skills");
const PERSONAL_SKILLS = join(homedir(), ".config", "alma", "skills");

function log(logger, ...args) {
  (logger?.info ? logger.info.bind(logger) : console.log)(...args);
}

function warn(logger, ...args) {
  (logger?.warn ? logger.warn.bind(logger) : console.warn)(...args);
}

function linkTargetsOurPlugin(linkPath) {
  try {
    return readlinkSync(linkPath).startsWith(SKILLS_SRC);
  } catch {
    return false;
  }
}

export async function activate(context) {
  const logger = context?.logger;

  if (!existsSync(SKILLS_SRC)) {
    return { dispose() {} };
  }

  const linked = [];

  mkdirSync(PERSONAL_SKILLS, { recursive: true });

  for (const entry of readdirSync(SKILLS_SRC, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const src = join(SKILLS_SRC, entry.name);
    const dest = join(PERSONAL_SKILLS, entry.name);

    let existing = null;
    try {
      existing = lstatSync(dest);
    } catch {
      // not present
    }

    if (existing?.isSymbolicLink()) {
      if (linkTargetsOurPlugin(dest)) {
        rmSync(dest); // refresh our own link
      } else {
        warn(logger, `[wen-alma] skill '${entry.name}' exists as another symlink; skipping`);
        continue;
      }
    } else if (existing) {
      warn(logger, `[wen-alma] skill '${entry.name}' already exists in personal skills; skipping`);
      continue;
    }

    symlinkSync(src, dest, "dir");
    linked.push(dest);
    log(logger, `[wen-alma] linked skill '${entry.name}' -> ${src}`);
  }

  return {
    dispose() {
      for (const dest of linked) {
        try {
          if (linkTargetsOurPlugin(dest)) rmSync(dest);
        } catch {
          // already gone
        }
      }
      // Also sweep links from a previous activation that this process did
      // not create in this run (e.g. plugin updated in place).
      if (existsSync(PERSONAL_SKILLS)) {
        for (const entry of readdirSync(PERSONAL_SKILLS, { withFileTypes: true })) {
          const dest = join(PERSONAL_SKILLS, entry.name);
          if (entry.isSymbolicLink() && linkTargetsOurPlugin(dest)) {
            try { rmSync(dest); } catch {}
          }
        }
      }
    },
  };
}
