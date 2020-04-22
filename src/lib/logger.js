const winston = require('winston');

const today = new Date();
const fileDate = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
const myFormat = winston.format.printf(({ message }) => {
  return message;
});
const logger = winston.createLogger({
  format: winston.format.combine(myFormat),
  transports: [
    new winston.transports.File({ filename: `logs/${fileDate}.log` }),
  ],
});

function log(message) {
  logger.log('info', message);
}

module.exports = {
  log,
};
