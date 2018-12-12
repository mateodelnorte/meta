jest.mock('fs');

const findPlugins = require('../findPlugins');
const cp = require('child_process');
const fs = require('fs');

describe('findPlugins', () => {
  beforeEach(() => {
    fs.reset();
    process.env.NODE_PATH = '';
  });

  it('ignores non-plugins', () => {
    fs.write('/node_modules/@foo/bar/index.js', '');
    fs.write('/node_modules/foo/index.js', '');
    expect(findPlugins('/')).toMatchSnapshot();
  });

  it('finds scoped plugins', () => {
    fs.write('/node_modules/@foo/meta-foo/index.js', '');
    expect(findPlugins('/')).toMatchSnapshot();
  });

  it('finds non-scoped plugins', () => {
    fs.write('/node_modules/meta-foo/index.js', '');
    expect(findPlugins('/')).toMatchSnapshot();
  });

  it('skips plugins whose name is already in use', () => {
    fs.write('/node_modules/@foo/meta-foo/index.js', '');
    fs.write('/node_modules/meta-foo/index.js', '');
    expect(findPlugins('/')).toMatchSnapshot();
  });

  it('searches every parent directory', () => {
    fs.write('/node_modules/meta-0/index.js', '');
    fs.write('/1/node_modules/meta-1/index.js', '');
    fs.write('/1/2/node_modules/meta-2/index.js', '');
    fs.write('/1/2/3/node_modules/meta-3/index.js', '');
    fs.write('/1/2/3/index.js', '');
    expect(findPlugins('/1/2/3')).toMatchSnapshot();
  });

  it('searches every global directory', () => {
    fs.write('/foo/meta-foo/index.js', '');
    fs.write('/bar/@foo/meta-bar/index.js', '');

    process.env.NODE_PATH = '/foo:/bar';
    expect(findPlugins('/dev')).toMatchSnapshot();
  });

  it('falls back to (npm root -g) when $NODE_PATH is empty', () => {
    fs.write('/npm/root/foo/index.js', '');
    fs.write('/npm/root/meta-1/index.js', '');
    fs.write('/npm/root/@foo/meta-2/index.js', '');

    delete process.env.NODE_PATH;
    cp.execSync = jest.fn(() => '/npm/root');

    expect(findPlugins('/')).toMatchSnapshot();
    expect(cp.execSync.mock.calls).toEqual([['npm root -g']]);
  });

  it('tolerates missing "node_modules" when searching parent directories', () => {
    fs.write('/1/node_modules/meta-1/index.js', '');
    fs.write('/1/2/3/node_modules/meta-3/index.js', '');
    fs.write('/1/2/3/4/index.js', '');

    // Directories #2 and #4 have no "node_modules"
    expect(findPlugins('/1/2/3/4')).toMatchSnapshot();
  });
});
