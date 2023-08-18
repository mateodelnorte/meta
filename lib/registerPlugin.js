const { gray, green, red, yellow } = require('chalk');
const debug = require('debug')('meta');
const path = require('path');
const tildify = require('tildify');

module.exports = (program, pluginPath, summary) => {
  try {
    const plugin = require(pluginPath);
    if (plugin.register) {
      plugin.register(program);
      debug(`  ${green('+')} ${path.basename(pluginPath)} ${yellow(tildify(pluginPath))}`);
      summary.success++;
    } else {
      debug(`  ${red('×')} ${path.basename(pluginPath)} ${gray('(not a plugin)')}`);
      summary.skipped++;
    }
  } catch (e) {
    console.warn(`Plugin registration failed: '${tildify(pluginPath)}'`);
    console.error(e);
    summary.errors++;
  }
};
