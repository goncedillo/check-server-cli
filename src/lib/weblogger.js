const fs = require('fs');

function log({ servers, serverName, date, status, filePath, info }) {
  if (!servers || !serverName || !filePath) {
    return;
  }

  const serversClone = [...servers];
  const currentServer = serversClone.find((item) => item.name === serverName);

  if (!currentServer) {
    return;
  }

  currentServer.date = date;
  currentServer.status = status;

  const data = {
    info: info,
    servers: serversClone,
  };

  fs.writeFileSync(filePath, JSON.stringify(data));
}

module.exports = { log };
