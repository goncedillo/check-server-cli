const winston = require('winston');

const today = new Date();
const fileDate = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;

function log(message) {
  const myFormat = winston.format.printf(({ message }) => message);
  const logger = winston.createLogger({
    format: winston.format.combine(myFormat),
    transports: [
      new winston.transports.File({ filename: `logs/${fileDate}.log` }),
    ],
  });

  logger.log('info', message);
}

module.exports = {
  log,
};
