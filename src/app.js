process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const path = require('path');
const childProcess = require('child_process');
const dayjs = require('dayjs');
const CronJob = require('cron').CronJob;

const logger = require('./lib/logger');
const checker = require('./lib/checker');
const weblogger = require('./lib/weblogger');

const config = require('../config.json');
const servers = [...config.servers];

async function checkServer(server) {
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
    info: config.info,
  });
}

function checkAllServers() {
  servers.forEach((server) => {
    checkServer(server);
  });
}

function checkForConfig() {
  if (!config.servers || !config.servers.length) {
    return console.log(`
        ¡Debes proporcionar un config.json válido!
    `);
  }
}

function start() {
  checkForConfig();

  new CronJob(`${config.timer || 5} * * * * *`, checkAllServers).start();

  childProcess.spawn('npx', ['serve'], {
    cwd: path.resolve(process.cwd(), 'static'),
    stdio: 'inherit',
  });
  checkAllServers();
}

module.exports = {
  start,
};
