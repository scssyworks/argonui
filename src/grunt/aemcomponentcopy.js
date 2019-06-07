const config = require('../config.json');
const options = {
  replaceTargetContentXml: true,
  useDummyContentXml: true,
  componentGroup: config.aem.componentGroup,
  mode: 'development'
};
const prodOptions = Object.assign({}, options, {
  mode: 'production'
});
const files = [
  {
    expand: true,
    dot: true,
    cwd: config.aem.src.componentPath,
    src: ['**/*.html', '!**/*Sample.hbs'],
    dest: config.aem.target.componentPath
  },
  {
    expand: true,
    dot: true,
    cwd: config.aem.src.atomPath,
    src: ['**/*.html', '!**/*Sample.hbs'],
    dest: config.aem.target.atomPath
  },
  {
    expand: true,
    dot: true,
    cwd: config.aem.src.moleculePath,
    src: ['**/*.html', '!**/*Sample.hbs'],
    dest: config.aem.target.moleculePath
  }
];
module.exports = {
  uxlib: {
    options,
    files
  },
  uxlibProd: {
    options: prodOptions,
    files
  }
};
