const fs = require('fs');
const app = require('../app');
const checker = require('../lib/checker');
const cron = require('cron');
const loader = require('../lib/loader');
const logger = require('../lib/logger');
const weblogger = require('../lib/weblogger');

jest.mock('cron');
jest.mock('fs');
jest.mock('child_process');
jest.mock('../lib/checker');
jest.mock('../lib/weblogger');
jest.mock('../lib/loader', () => ({
  loadFile: jest.fn().mockResolvedValue({}),
}));
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
  jest.restoreAllMocks();
});

describe('App', () => {
  it('should throw an exception when a config.json is not provided', async () => {
    const spy = jest.spyOn(console, 'log');

    fs.readFile.mockImplementation((path, cb) => {
      cb(true, '');
    });

    await app.start();

    await expect(spy).toHaveBeenCalledTimes(1);
    await expect(spy).toHaveBeenCalledWith(
      'You must provide a valid path to config file'
    );
  });

  it('should throw an exception when servers are not provided', async () => {
    const spy = jest.spyOn(console, 'log');

    loader.loadFile.mockResolvedValue({
      servers: [],
    });

    fs.readFile.mockImplementation((path, cb) => {
      const data = JSON.stringify({});
      cb(null, data);
    });

    await app.start({
      configFile: '.',
      isLoggerMode: true,
    });

    await expect(spy).toHaveBeenCalledTimes(1);
    await expect(spy).toHaveBeenCalledWith(
      'You must provide a valid path to config file'
    );
  });

  it('should throw an exception when mode is not given', async () => {
    const spy = jest.spyOn(console, 'log');

    loader.loadFile = jest.fn().mockResolvedValueOnce({
      servers: [''],
    });

    fs.readFile.mockImplementation((path, cb) => {
      const data = JSON.stringify({ servers: [] });
      cb(null, data);
    });

    await app.start({
      configFile: '.',
    });

    await expect(spy).toHaveBeenCalledTimes(1);
    await expect(spy).toHaveBeenCalledWith(
      'You must use --server or --logger mode at least :( Bye'
    );
  });

  it('should log data if logger mode is present', async () => {
    loader.loadFile = jest.fn().mockResolvedValueOnce({
      servers: [''],
    });

    checker.getStatus.mockResolvedValue({
      message: '',
      status: 200,
    });

    fs.readFile.mockImplementation((path, cb) => {
      const data = JSON.stringify({ servers: [] });
      cb(null, data);
    });

    await app.start({
      configFile: '.',
      isLoggerMode: true,
    });

    expect(logger.log).toHaveBeenCalled();
  });

  it('should log to web if server mode is present', async () => {
    loader.loadFile = jest.fn().mockResolvedValueOnce({
      servers: [''],
    });

    checker.getStatus.mockResolvedValue({
      message: '',
      status: 200,
    });

    fs.readFile.mockImplementation((path, cb) => {
      const data = JSON.stringify({ servers: [] });
      cb(null, data);
    });

    await app.start({
      configFile: '.',
      isServerMode: true,
    });

    expect(weblogger.log).toHaveBeenCalled();
  });
});
