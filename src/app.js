process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const dayjs = require('dayjs');
const CronJob = require('cron').CronJob;

const logger = require('./lib/logger');
const checker = require('./lib/checker');
const weblogger = require('./lib/weblogger');

const configError = new Error('You must povide a valid config.json');

async function checkServer(server, servers, info) {
  const filePath = path.resolve(process.cwd(), 'static', 'current-status.json');
  const now = dayjs().toString();
  const dateToRegister = dayjs(now).format('DD-MM-YYYY HH:mm');

  const { message, status } = await checker.getStatus(server, dateToRegister);

  logger.log(message);
  weblogger.log({
    servers,
    serverName: server.name,
    date: now,
    status,
    filePath,
    info,
  });
}

function checkAllServers(servers, configInfo) {
  servers.forEach((server) => {
    checkServer(server, servers, configInfo);
  });
}

function loadConfig(pathToConfig) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathToConfig, (err, data) => {
      if (err) reject(configError);

      const config = JSON.parse(data);

      if (!config.servers || !config.servers.length) {
        return reject(configError);
      }

      resolve(config);
    });
  });
}

async function start() {
  const config = await loadConfig(path.resolve(process.cwd(), 'config.json'));

  new CronJob(`${config.timer || 5} * * * *`, () => {
    checkAllServers(config.servers, config.info);
  }).start();

  childProcess.spawn('npx', ['serve'], {
    cwd: path.resolve(process.cwd(), 'static'),
    stdio: 'inherit',
  });

  checkAllServers(config.servers, config.info);
}

module.exports = {
  start,
};
