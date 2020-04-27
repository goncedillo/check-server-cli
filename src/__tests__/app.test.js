const fs = require('fs');
const app = require('../app');
const checker = require('../lib/checker');
const cron = require('cron');

jest.mock('cron');
jest.mock('fs');
jest.mock('child_process');
jest.mock('../lib/checker');
jest.mock('../lib/weblogger');
jest.mock('../lib/logger', () => ({
  log: jest.fn(),
}));

beforeEach(() => {
  cron.CronJob.mockImplementation((time, cb) => {
    return {
      start: () => {
        cb();
      },
    };
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('App', () => {
  it('should throw an exception when a config.json is not provided', async () => {
    fs.readFile.mockImplementation((path, cb) => {
      cb(true, '');
    });

    await expect(() => app.start()).rejects.toThrow();
  });

  it('should throw an exception when servers are not provided', async () => {
    fs.readFile.mockImplementation((path, cb) => {
      const data = JSON.stringify({});
      cb(null, data);
    });

    await expect(() => app.start()).rejects.toThrow();
  });

  it('should throw an exception when there are not servers', async () => {
    fs.readFile.mockImplementation((path, cb) => {
      const data = JSON.stringify({ servers: [] });
      cb(null, data);
    });

    await expect(() => app.start()).rejects.toThrow();
  });

  it('should log as many server as are given', async () => {
    const servers = [
      { name: '#1', status: false },
      { name: '#2', status: false },
    ];
    checker.getStatus.mockResolvedValue({
      message: '',
      status: false,
    });
    fs.readFile.mockImplementation((path, cb) => {
      const data = JSON.stringify({ servers });
      cb(null, data);
    });

    await app.start();

    expect(checker.getStatus).toHaveBeenCalledTimes(servers.length * 2);
  });
});
