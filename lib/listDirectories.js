const debug = require('debug')('meta:listDirectories');
const fs = require('fs');
const path = require('path');
const union = require('lodash.union');
const findupSync = require('findup-sync');

const regex = /^meta-.*/;

const getModulesInDirectory = (dir, foundFiles=[]) => {
  let files = fs.readdirSync(dir);
  files.forEach((file) => {
    if (file.startsWith('@')) {
      files = files.concat(fs.readdirSync(`${dir}/${file}`));
    }
  });
  return files.filter((file) => {
    return (
    (fs.statSync(path.join(dir, file)).isDirectory() ||
      fs.lstatSync(path.join(dir, file)).isSymbolicLink()) &&
    regex.test(file) && !foundFiles.includes(file)
  );
  });
};

module.exports = dir => {
  const localdir = findupSync('node_modules', { cwd: process.cwd() });

  debug(`listing all child directories matching ${regex} in ${localdir}`);

  var localPlugins, localPluginsFullPath;

  try {
    localPlugins = getModulesInDirectory(localdir);

    localPluginsFullPath = localPlugins.map(r => {
      return path.resolve(localdir, r);
    });

    debug(`found local plugins ${localPlugins}`);
  } catch (error) {
    debug(`no meta plugins found in ${localdir}`);
    localPlugins = [];
  }

  debug(`listing all child directories matching ${regex} in ${dir}`);

  const globalPlugins = getModulesInDirectory(dir, localPlugins);

  debug(`found global plugins ${globalPlugins}`);

  const globalPluginsFullPath = globalPlugins.map(r => {
    return path.resolve(dir, r);
  });

  return union(localPluginsFullPath, globalPluginsFullPath).sort((a, b) => {
    if (path.basename(a) < path.basename(b)) return -1;
    if (path.basename(a) > path.basename(b)) return 1;
    return 0;
  });

  return globalPlugins;
};
