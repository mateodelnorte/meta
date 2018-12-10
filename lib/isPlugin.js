const path = require('path');

// This is mocked during tests to factor out `isImportable`
module.exports = filePath =>
  /^meta-/.test(path.basename(filePath)) && isImportable(filePath);

function isImportable(filePath) {
  try {
    require.resolve(filePath);
    return true;
  } catch (e) {}
  return false;
}
