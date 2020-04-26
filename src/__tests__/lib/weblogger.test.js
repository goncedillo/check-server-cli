const fs = require('fs');
const weblogger = require('../../lib/weblogger');

jest.mock('fs');

afterEach(() => {
  jest.clearAllMocks();
});

describe('Weblogger module', () => {
  it("shouldn't write anything when 'servers' are not given", () => {
    weblogger.log({});

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it("shouldn't write anything when 'serverName' is not given", () => {
    weblogger.log({
      servers: [],
    });

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it("shouldn't write anything when 'filePath' is not given", () => {
    weblogger.log({
      servers: [],
      serverName: 'dsda',
    });

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it("shouldn't write anything when there is not a matching server", () => {
    weblogger.log({
      servers: [{ name: 'other' }],
      serverName: 'dsda',
      filePath: 'some/path',
    });

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it('should write data when there is a matching server', () => {
    weblogger.log({
      servers: [{ name: 'some' }],
      serverName: 'some',
      filePath: 'some/path',
    });

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
  });

  it('should write right data in file', () => {
    weblogger.log({
      servers: [{ name: 'some' }],
      serverName: 'some',
      filePath: 'some/path',
      date: '',
      status: true,
      info: '',
    });

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'some/path',
      JSON.stringify({
        info: '',
        servers: [{ name: 'some', date: '', status: true }],
      })
    );
  });
});
