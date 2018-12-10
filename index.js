const debug = require('debug')('meta');
const fs = require('fs');
const path = require('path');
const meta = require('./package.json');
const findPlugins = require('./lib/findPlugins');
const registerPlugin = require('./lib/registerPlugin');

// Plugins depended on by the `meta` package.
const corePlugins = new Map();
Object.keys(meta.dependencies).forEach(
  name => /^meta-/.test(name) && corePlugins.set(name, require.resolve(name))
);

exports.version = meta.version;

exports.run = (cwd, argv) => {
  const program = require('commander').version(meta.version);

  // Ensure `cwd` is actually the working directory.
  cwd = path.resolve(cwd);
  process.chdir(cwd);

  // Load user plugins.
  const userPlugins = findPlugins(cwd);
  userPlugins.forEach(userPluginPath =>
    registerPlugin(program, userPluginPath)
  );

  // Load core plugins after, so users can override them.
  corePlugins.forEach((corePluginPath, name) => {
    const userPluginPath = userPlugins.get(name);
    if (userPluginPath) {
      debug(`skipping plugin '${corePluginPath}' because '${userPluginPath}' is already in use`) // prettier-ignore
    } else {
      registerPlugin(program, corePluginPath);
    }
  });

  if (fs.existsSync('.meta')) {
    const gitPlugin = userPlugins.get('meta-git') || 'meta-git';
    require(gitPlugin).update({ dryRun: true });
  }

  program.parse(argv);
};
