const debug = require('debug')('meta:registerPlugin');

module.exports = (program, pluginPath) => {
  plugin = require(pluginPath);
  if (typeof plugin.register === 'function') {
    debug(`Registering plugin: '${pluginPath}'`);
    plugin.register(program);
  } else {
    debug(`Plugin has no "register" function: '${pluginPath}'`);
  }
};
