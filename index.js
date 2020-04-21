process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const axios = require('axios');
const winston = require('winston');
const dayjs = require('dayjs');
const emojis = require('emojis');
const CronJob = require('cron').CronJob;
const config = require('./config.json');

if (!config.servers || !config.servers.length) {
    return console.log(`
        ¡Debes proporcionar un config.json válido!
    `);
}

const servers = [
    ...config.servers
];

const today = new Date();
const fileDate = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
const myFormat = winston.format.printf(({ message }) => {
    return message;
  });
const logger = winston.createLogger({
    format: winston.format.combine(
        myFormat
    ),
    transports: [
        new winston.transports.File({ filename: `logs/${fileDate}.log`})
    ]
});



async function checkServer(server) {
    const now = dayjs().toString();
    const dateToRegister = dayjs(now).format('DD-MM-YYYY HH:mm');
    
    try {
        const request = await axios.get(server.url);
        const statusResult = request.status.toString() === '200';
        const resultToPrint = statusResult ? emojis.unicode(':white_check_mark:') : emojis.unicode(':warning:');

        logger.log('info', `<${server.name.toUpperCase()}> ${dateToRegister} - ${resultToPrint}`);
        setWebStatus(server.name, now, statusResult)
    } catch (err) {
        logger.log('info', `<${server.name.toUpperCase()}> ${dateToRegister} - ${emojis.unicode(':warning:')}`);
        setWebStatus(server.name, now, false)
    }

}

function setWebStatus(serverName, date, status) {
    const file = path.resolve(__dirname, 'static','current-status.json');
    const serversClone = [...servers];
    const currentServer = serversClone.find(item => item.name === serverName);

    currentServer.date = date;
    currentServer.status = status;

    const data = {
        info: config.info,
        servers: serversClone
    };

    fs.writeFileSync(file, JSON.stringify(data));
}

function checkAllServers() {
    servers.forEach(server => {
        checkServer(server);
    });
}

// new CronJob('5 * * * * *', checkAllServers).start();

childProcess.spawn('npx', ['serve'], {
    cwd: path.resolve(__dirname, 'static'),
    stdio: 'inherit'
});

checkServer(servers[0]);

