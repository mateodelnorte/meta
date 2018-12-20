const { gray, green, red, yellow } = require('chalk');
const debug = require('debug')('meta');
const path = require('path');
const tildify = require('tildify');

module.exports = (program, pluginPath) => {
  try {
    const plugin = require(pluginPath);
    if (plugin.register) {
      plugin.register(program);
      debug(`  ${green('+')} ${path.basename(pluginPath)} ${yellow(tildify(pluginPath))}`); // prettier-ignore
    } else {
      debug(`  ${red('×')} ${path.basename(pluginPath)} ${gray('(not a plugin)')}`); // prettier-ignore
    }
  } catch (e) {
    console.warn(`Plugin registration failed: '${tildify(pluginPath)}'`);
    console.error(e);
  }
};
