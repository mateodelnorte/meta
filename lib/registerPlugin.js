const { green, yellow } = require('chalk');
const debug = require('debug')('meta');
const path = require('path');
const tildify = require('tildify');

module.exports = (program, pluginPath) => {
  try {
    debug(`  ${green('+')} ${path.basename(pluginPath)} ${yellow(tildify(pluginPath))}`); // prettier-ignore
    require(pluginPath).register(program);
  } catch (e) {
    console.warn(`Plugin registration failed: '${tildify(pluginPath)}'`);
    console.error(e);
  }
};
