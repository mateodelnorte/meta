import debugModule from "debug";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import meta from "../package.json" assert { type: "json" };
import findPlugins from "./lib/findPlugins.js";
import registerPlugin from "./lib/registerPlugin.js";
import { createRequire } from "module";
import { program } from "commander";

const { green, gray } = chalk;
const debug = debugModule("meta");

// Plugins depended on by the `meta` package.
const corePlugins = new Map();
Object.keys(meta.dependencies).forEach(async (name) => {
  if (/^meta-/.test(name)) {
    const require = createRequire(import.meta.url);
    const packagePath = require.resolve(path.join(name, "package.json"));
    corePlugins.set(name, path.dirname(packagePath));
  }
});

export const version = meta.version;

export const run = async (cwd, argv) => {
  // const program = require("commander").version(meta.version);

  // Ensure `cwd` is actually the working directory.
  cwd = path.resolve(cwd);
  process.chdir(cwd);

  // Load user plugins.
  const userPlugins = findPlugins(cwd);
  if (userPlugins.size) {
    debug(`\nLoading plugins:`);
    userPlugins.forEach((pluginPath) => registerPlugin(program, pluginPath));
  }

  // Load core plugins after, so users can override them.
  debug(`\nLoading core plugins:`);
  corePlugins.forEach((pluginPath, name) => {
    if (userPlugins.has(name)) return debug(`  ${green('+')} ${name} ${gray('(skip)')}`); // prettier-ignore
    registerPlugin(program, pluginPath);
  });

  if (fs.existsSync(".meta")) {
    const gitPlugin = userPlugins.get("meta-git") || "meta-git";
    const mGit = await import(gitPlugin);
    mGit.update({ dryRun: true });
  }

  (program as any).parse(argv);
};
