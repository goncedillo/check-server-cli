process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const path = require('path');
const childProcess = require('child_process');
const dayjs = require('dayjs');
const cron = require('cron');
const CronJob = cron.CronJob;

const logger = require('./lib/logger');
const checker = require('./lib/checker');
const weblogger = require('./lib/weblogger');
const loader = require('./lib/loader');

const configError = new Error('You must povide a valid config.json');

async function checkServer(server, data, config) {
  const now = dayjs().toString();
  const dateToRegister = dayjs(now).format('DD-MM-YYYY HH:mm');

  const { message, status } = await checker.getStatus(server, dateToRegister);

  if (data.isLoggerMode) {
    logger.log(message, data.outputPath);
  }

  if (data.isServerMode) {
    weblogger.log({
      serverName: server.name,
      filePath: path.resolve(
        __dirname,
        '..',
        'static',
        './current-status.json'
      ),
      date: now,
      servers: config.servers,
      info: config.info,
      status,
    });
  }
}

function checkAllServers(config, data) {
  config &&
    config.servers &&
    config.servers.forEach((server) => {
      checkServer(server, data, config);
    });
}

async function loadConfig(pathToConfig) {
  const config = await loader.loadFile(pathToConfig);

  if (!config.servers || !config.servers.length) {
    return reject(configError);
  }

  return config;
}

async function start(data) {
  try {
    const { configFile, isServerMode, isLoggerMode } = data;
    const config = await loadConfig(path.normalize(configFile));

    if (!isLoggerMode && !isServerMode) {
      return console.log(
        'You must use --server or --logger mode at least :( Bye'
      );
    }

    new CronJob(`0 */${config.timer || 5} * * * *`, async () => {
      await checkAllServers(config, data);
    }).start();

    if (isServerMode) {
      childProcess.spawn('npx', ['serve'], {
        cwd: path.resolve(__dirname, '..', 'static'),
        stdio: 'inherit',
      });
    }

    await checkAllServers(config, data);
  } catch (err) {
    console.log('You must provide a valid path to config file');
  }
}

module.exports = {
  start,
};
