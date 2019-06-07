var path = require('path'),
  config = require('../config.json'),
  files = config.assemble.pages.files;
files.forEach(function (fileOption) {
  Object.assign(fileOption, {
    rename: function (dest, src) {
      var dirname = path.dirname(src);
      var componentName = path.basename(dirname);
      var fileName = path.basename(src, '.hbs');
      return path.join(dest, componentName, fileName);
    }
  });
});
module.exports = {
  options: Object.assign(
    {
      version: '<%= package.version %>',
      date: '<%= config.date %>'
    }, config.assemble.options
  ),
  pages: {
    options: config.assemble.pages.options,
    files: files
  }
};
