const fs = require('fs');

function loadFile(pathToFile) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathToFile, (err, data) => {
      if (err) return reject(err);

      resolve(JSON.parse(data));
    });
  });
}

module.exports = {
  loadFile,
};
