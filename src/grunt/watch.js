var config = require('../config').watch;
module.exports = {
  options: {
    interval: 250
  },
  assemble: {
    files: config.assemble.files,
    tasks: config.assemble.tasks,
    options: {
      spawn: false
    }
  },
  static: {
    files: config.static.files,
    tasks: config.static.tasks
  },
  aemcomponentcopy: {
    files: config.aem.files,
    tasks: config.aem.tasks
  }
};
