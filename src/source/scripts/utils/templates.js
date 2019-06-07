const templates = {};

const reqr = require.context('../../templates-hbs', true, /\.hbs$/);
reqr.keys().forEach(file => {
  if (typeof file === 'string') {
    const fileName = file.substring(file.lastIndexOf('/') + 1).replace(/\.hbs$/, '').trim();
    if (fileName) {
      templates[fileName] = reqr(file);
    }
  }
});

export { templates };
