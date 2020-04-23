const emojis = require('emojis');
const axios = require('axios');

async function getStatus(server, date) {
  if (!server || !server.name || !server.url) {
    throw new Error('You must provide a server object with name and url');
  }

  let message = '';
  let status = false;

  try {
    const request = await axios.get(server.url);
    const statusResult = request.status.toString() === '200';
    const resultToPrint = statusResult
      ? emojis.unicode(':white_check_mark:')
      : emojis.unicode(':red_circle:');

    (message = `<${server.name.toUpperCase()}> ${date} - ${resultToPrint}`),
      (status = statusResult);
  } catch (err) {
    message = `<${server.name.toUpperCase()}> ${date} - ${emojis.unicode(
      ':red_circle:'
    )}`;
  }

  return {
    message,
    status,
  };
}

module.exports = { getStatus };
