const debug = require('debug')('meta:listDirectories');
const fs = require('fs');
const path = require('path');
const union = require('lodash.union');

module.exports = (dir) => {

  const localdir = path.join(process.cwd(), 'node_modules');

  debug(`listing all child directories matching /meta-.*/ in ${localdir}`);

  var localPlugins, localPluginsFullPath;

  try {
    localPlugins = fs.readdirSync(localdir).filter((file) => {
      return (fs.statSync(path.join(localdir, file)).isDirectory() || fs.lstatSync(path.join(localdir, file)).isSymbolicLink()) && /meta-.*/.test(file);
    });

    localPluginsFullPath = localPlugins.map((r) => { return path.resolve(localdir, r); }); 

    debug(`found local plugins ${localPlugins}`);

  } catch (error) {
    debug(`no meta plugins found in ${localdir}`);
    localPlugins = [];
  }

  debug(`listing all child directories matching /meta-.*/ in ${dir}`);
  
  const globalPlugins = fs.readdirSync(dir).filter((file) => {
    return (fs.statSync(path.join(dir, file)).isDirectory() || ! fs.lstatSync(path.join(dir, file)).isSymbolicLink()) 
          && /meta-.*/.test(file)
          && localPlugins.indexOf(file) === -1;
  });

  debug(`found global plugins ${globalPlugins}`);
  
  const globalPluginsFullPath = globalPlugins.map((r) => { return path.resolve(dir, r); });

  return union(localPluginsFullPath, globalPluginsFullPath).sort((a, b) => { 
    if (path.basename(a) < path.basename(b)) return -1;
    if (path.basename(a) > path.basename(b)) return 1;
    return 0;
  });

  return globalPlugins;
};