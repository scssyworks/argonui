var config = require('../config.json').webfont;
module.exports = {
  icons: {
    src: config.src,
    dest: config.target,
    destScss: config.scss.target,
    options: {
      font: config.fontFile,
      syntax: "bootstrap",
      stylesheets: ["scss"],
      relativeFontPath: config.relativePath
    }
  }
};
