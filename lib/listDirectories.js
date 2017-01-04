const debug = require('debug')('meta:listDirectories');
const fs = require('fs');
const path = require('path');

module.exports = (dir) => {
  debug(`listing all child directories matching /meta-.*/ in ${dir}`);
  return fs.readdirSync(dir).filter((file) => {
    return fs.statSync(path.join(dir, file)).isDirectory() && /meta-.*/.test(file);
  });
};