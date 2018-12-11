const fs = jest.genMockFromModule('fs');

let files;
fs.reset = () => (files = {});
fs.write = (filePath, content) => {
  const parts = filePath.split('/');
  for (let i = 0, parent = ''; i < parts.length; i++) {
    const name = parent + (i > 1 ? '/' : '') + (parts[i] || '/');
    if (i < parts.length - 1) {
      if (name in files) {
        parent = name;
        continue;
      }
      files[name] = [];
    } else {
      files[name] = content;
    }
    if (parent) files[parent].push(parts[i]);
    parent = name;
  }
};

fs.statSync = name => {
  if (!(name in files)) {
    throw Error(`Path does not exist: '${name}'`);
  }
  const stats = new fs.Stats();
  stats.isDirectory = () => Array.isArray(files[name]);
  return stats;
};

fs.readdirSync = name => {
  const names = files[name];
  if (Array.isArray(names)) return names;
  throw Error(`Path is not a directory: '${name}'`);
};

module.exports = fs;
