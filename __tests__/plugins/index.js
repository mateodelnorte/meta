const cp = require('child_process');

describe('plugins', () => {
  it('can be executed using exact executable name', () => {
    const cmd = cp.execSync('npx meta-project').toString();
    expect(cmd).toMatchSnapshot();
  });
  it('can be executed using git style subcommands', () => {
    const cmd = cp.execSync('npx meta project').toString();
    expect(cmd).toMatchSnapshot();
  });
  it('can be executed using local plugin discovery', () => {
    const cmd = cp.execSync('./bin/meta project').toString();
    expect(cmd).toMatchSnapshot();
  });
  it('should include meta gh as dev dependency', () => {
    const cmd = cp.execSync('./bin/meta gh').toString();
    expect(cmd).toMatchSnapshot();
  });
  it('should include meta git as dependency', () => {
    const cmd = cp.execSync('./bin/meta git').toString();
    expect(cmd).toMatchSnapshot();
  });
  it('should include meta init as dependency', () => {
    const cmd = cp.execSync('./bin/meta init').toString();
    expect(cmd).toMatchSnapshot();
  });
  it('should include meta exec as dependency', () => {
    const cmd = cp.execSync('./bin/meta exec').toString();
    expect(cmd).toMatchSnapshot();
  });
  it('should include meta npm as dev dependency', () => {
    const cmd = cp.execSync('./bin/meta npm').toString();
    expect(cmd).toMatchSnapshot();
  });
  it('should include meta project as dependency', () => {
    const cmd = cp.execSync('./bin/meta project').toString();
    expect(cmd).toMatchSnapshot();
  });
  it('should include meta yarn as dev dependency', () => {
    const cmd = cp.execSync('./bin/meta yarn').toString();
    expect(cmd).toMatchSnapshot();
  });
});
