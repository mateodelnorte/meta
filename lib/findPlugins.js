const cp = require('child_process');
const debug = require('debug')('meta:findPlugins');
const fs = require('fs');
const path = require('path');
const isPlugin = require('./isPlugin');

/**
 * Meta's custom plugin resolution logic
 *
 * The `cwd` argument must be an absolute path.
 *
 * Returns a `Map` object that maps plugin names to plugin paths.
 */
module.exports = (cwd, searchDir = 'node_modules') => {
  const rootDir = path.parse(cwd).root;
  const plugins = new Map();
  const onPlugin = (name, filePath) => {
    if (plugins.has(name)) {
      debug(`Skipping plugin: '${filePath}'\n  because '${plugins[name]}' is already in use`) // prettier-ignore
    } else {
      plugins.set(name, filePath);
    }
  };

  // Search relative to `cwd` first, then search every parent directory.
  let baseDir = cwd;
  while (true) {
    findNearbyPlugins(path.join(baseDir, searchDir), onPlugin);
    if (baseDir !== rootDir) baseDir = path.dirname(baseDir);
    else break;
  }

  // Search relative to every directory in $NODE_PATH.
  const root = cp.execSync('npm root').toString().trim();
  const globalRoot = cp.execSync('npm root -g').toString().trim();
  const defaultRoots = `${root}:${globalRoot}`;

  (process.env.NODE_PATH || defaultRoots).split(':').forEach(cwd =>
    findNearbyPlugins(cwd, onPlugin)
  );

  return plugins;
};

/** Check a directory for potentially-scoped /^meta-/ packages */
function findNearbyPlugins(cwd, onPlugin) {
  if (isDir(cwd)) {
    debug(`searching '${cwd}' for plugins`);
    fs.readdirSync(cwd).forEach(name => {
      const filePath = path.join(cwd, name);
      if (name[0] === '@') {
        const scopePath = filePath;
        fs.readdirSync(scopePath).forEach(name => {
          const filePath = path.join(scopePath, name);
          if (isPlugin(filePath)) onPlugin(name, filePath);
        });
      } else if (isPlugin(filePath)) {
        onPlugin(name, filePath);
      }
    });
  }
}

function isDir(filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch (e) {}
  return false;
}
