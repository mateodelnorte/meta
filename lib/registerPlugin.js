const debug = require('debug')('meta:registerPlugin');

module.exports = (program, pluginPath) => {
  try {
    pluginPath = require.resolve(pluginPath);
  } catch (e) {
    debug(`Failed to resolve plugin: '${pluginPath}'`);
    return;
  }
  plugin = require(pluginPath);
  if (plugin.register) {
    debug(`Registering plugin: '${pluginPath}'`);
    plugin.register(program);
  }
};
