const winston = require('winston');
const path = require('path');

const today = new Date();
const fileDate = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;

function log(message, outputPath) {
  const pathToSave = path.normalize(`${outputPath}/logs/${fileDate}.log`);
  const myFormat = winston.format.printf(({ message }) => message);
  const logger = winston.createLogger({
    format: winston.format.combine(myFormat),
    transports: [new winston.transports.File({ filename: pathToSave })],
  });

  logger.log('info', message);
}

module.exports = {
  log,
};
