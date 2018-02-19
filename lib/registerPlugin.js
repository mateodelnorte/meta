const debug = require('debug')('@essential-projects/meta:registerPlugin');

module.exports = (program, mod) => {
  const plugin = require(mod);
  if (plugin.register) {
    debug(`registering plugin ${mod}`);
    plugin.register(program);
  }
}

