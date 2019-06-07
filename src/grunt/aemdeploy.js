var config = require('../config.json');
module.exports = {
  options: {
    targets: [
      config.server
    ]
  },
  uxlibDemo: {
    src: [
      config.aem.src.content
    ]
  },
  components: {
    src: [
      config.aem.src.components
    ]
  },
  models: {
    src: [
      config.aem.src.models
    ]
  },
  staticassets: {
    src: [
      config.aem.src.staticassets
    ]
  },
  jsonData: {
    src: [
      config.aem.src.jsonData
    ]
  },
  contentXML: {
    src: [
      config.aem.src.contentXML
    ]
  }
};
