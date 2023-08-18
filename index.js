const { gray, green } = require('chalk');
const debug = require('debug')('meta');
const fs = require('fs');
const path = require('path');

const meta = require('./package.json');
const findPlugins = require('./lib/findPlugins');
const registerPlugin = require('./lib/registerPlugin');

const summary = {
  success: 0,
  errors: 0,
  skipped: 0
};

// Plugins depended on by the `meta` package.
const corePlugins = new Map();
Object.keys(meta.dependencies).forEach((name) => {
  if (/^meta-/.test(name)) {
    const packagePath = require.resolve(path.join(name, 'package.json'));
    corePlugins.set(name, path.dirname(packagePath));
  }
});

exports.version = meta.version;

exports.run = (cwd, argv) => {
  const program = require('commander').version(meta.version);

  // Ensure `cwd` is actually the working directory.
  cwd = path.resolve(cwd);
  process.chdir(cwd);

  // Load user plugins.
  const userPlugins = findPlugins(cwd);
  if (userPlugins.size) {
    debug(`\nLoading plugins:`);
    userPlugins.forEach((pluginPath) => registerPlugin(program, pluginPath, summary));
  }

  // Load core plugins after, so users can override them.
  debug(`\nLoading core plugins:`);
  corePlugins.forEach((pluginPath, name) => {
    if (userPlugins.has(name)) return debug(`  ${green('+')} ${name} ${gray('(skip)')}`); // prettier-ignore
    registerPlugin(program, pluginPath, summary);
  });

  if (fs.existsSync('.meta')) {
    const gitPlugin = userPlugins.get('meta-git') || 'meta-git';
    require(gitPlugin).update({ dryRun: true });
  }

  program.parse(argv);

  // After processing all plugins:
  console.log(`\nExecution Summary:`);
  console.log(`${summary.success}/${userPlugins.size + corePlugins.size} projects finished successfully`);
  console.log(`${summary.errors}/${userPlugins.size + corePlugins.size} projects had errors`);
  if (summary.skipped) {
    console.log(`${summary.skipped}/${userPlugins.size + corePlugins.size} projects were skipped`);
  }
};
