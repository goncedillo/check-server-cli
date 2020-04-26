const winston = require('winston');
const logger = require('../../lib/logger');

jest.mock('winston', () => ({
  format: {
    colorize: jest.fn(),
    combine: jest.fn(),
    label: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn().mockImplementation((cb) => cb({ message: '' })),
  },
  createLogger: jest.fn().mockReturnValue({
    debug: jest.fn(),
    log: jest.fn(),
  }),
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
  File: jest.fn(),
}));

describe('Logger', () => {
  it('should log message with "info" status', () => {
    const msg = 'a message';
    const spy = jest.fn();

    winston.createLogger = () => ({
      log: spy,
    });

    logger.log(msg);

    expect(spy).toHaveBeenCalledWith('info', msg);
  });
});
