let fs = require('fs-extra');

exports.logger = function (log) {
  if (typeof log === 'string') {
    log = `[${(new Date()).toLocaleString()}]: ${log}\n`;
    fs.appendFileSync('./affLogs.txt', log);
  } else if (typeof log === 'object' && log !== null) {
    log = `[${(new Date()).toLocaleString()}]: ${JSON.stringify(log)}\n`;
    fs.appendFileSync('./affLogs.txt', log);
    console.log(log);
  } else {
    console.log(log);
  }
}
