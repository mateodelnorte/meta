import chalk from "chalk";
import debugModule from "debug";
import path from "path";
import tildify from "tildify";

const { green, gray, red, yellow } = chalk;

const debug = debugModule("meta");

export default (program, pluginPath) => {
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
