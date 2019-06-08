// Generated on 2014-03-28 using generator-lessapp 0.4.9
'use strict';

var config = require("./argon.config.js");
module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-config')(grunt, {
    data: {
      config: {
        app: config.target,
        source: config.source,
        publish: config.clientlibPath,
        date: grunt.template.today('yyyy-mm-dd')
      },
    },
    jitGrunt: {
      staticMappings: {
        injector: 'grunt-asset-injector',
        buildcontrol: 'grunt-build-control',
        aemcomponentcopy: 'grunt-tasks/aem-component-copy.js',
        aemdeploy: 'grunt-tasks/aemsync-grunt.js',
        handlebars: 'grunt-handlebars.js',
        sasslint: 'grunt-sass-lint',
        csslint: 'grunt-contrib-csslint'
      }
    }
  });
};
