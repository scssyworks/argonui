const fs = require('fs-extra');
const clientlibPaths = require('./config.json').clientlibs;

if (
  clientlibPaths
  && typeof clientlibPaths === 'object'
) {
  Object.keys(clientlibPaths).forEach((clientlib) => {
    const clientlibPath = clientlibPaths[clientlib].js;
    try {
      const clientlibFiles = fs.readdirSync(clientlibPath);
      if (clientlibFiles && clientlibFiles.length) {
        clientlibFiles.forEach(fileName => {
          const firstPart = fileName.split('.')[0];
          fs.renameSync(
            `${clientlibPath}/${fileName}`,
            `${clientlibPath}/${firstPart}.js`
          );
        });
      }
    } catch (e) {
      console.log('Failed to read clientlib');
    }
  });
}
