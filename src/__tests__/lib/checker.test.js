const checker = require('../../lib/checker');
const axios = require('axios');

jest.mock('emojis');
jest.mock('axios');

afterAll(() => {
  jest.unmock('axios');
  jest.unmock('emojis');
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('Checker', () => {
  it('should throw an exception when no arguments are given', async () => {
    await expect(checker.getStatus()).rejects.toThrow();
  });

  it('should throw an exception when server name is not given', async () => {
    const server = {};

    await expect(checker.getStatus(server)).rejects.toThrow();
  });

  it('should throw an exception when server url is not given', async () => {
    const server = { name: 'a name' };

    await expect(checker.getStatus(server)).rejects.toThrow();
  });

  it('should return a fail message when something goes wrong', async () => {
    const server = { name: 'a name', url: 'someurl' };

    axios.get.mockRejectedValue(new Error());

    const data = await checker.getStatus(server);

    expect(data.status).toBeFalsy();
  });

  it('should return a fail message when request goes wrong', async () => {
    const server = { name: 'a name', url: 'someurl' };

    axios.get.mockResolvedValue({ status: 500 });

    const data = await checker.getStatus(server);

    expect(data.status).toBeFalsy();
  });

  it('should return a successful message when the request is ok', async () => {
    const server = { name: 'a name', url: 'someurl' };

    axios.get.mockResolvedValue({ status: 200 });

    const data = await checker.getStatus(server);

    expect(data.status).toBe(true);
  });
});
