const debug = require('debug')('meta:listDirectories');
const fs = require('fs');
const path = require('path');
const union = require('lodash.union');

module.exports = (dir) => {

  debug(`listing all child directories matching /meta-.*/ in ${dir}`);
  
  const globalPlugins = fs.readdirSync(dir).filter((file) => {
    return fs.statSync(path.join(dir, file)).isDirectory() && /meta-.*/.test(file);
  }).map((r) => { return path.resolve(dir, r); });

  dir = path.join(process.cwd(), 'node_modules');

  debug(`listing all child directories matching /meta-.*/ in ${dir}`);

  try {

    const localPlugins = fs.readdirSync(dir).filter((file) => {
      return fs.statSync(path.join(dir, file)).isDirectory() && /meta-.*/.test(file);
    }).map((r) => { return path.resolve(dir, r); }); 

    return union(localPlugins, globalPlugins);

  } catch (error) {
    return globalPlugins;
  }

  return globalPlugins;
};