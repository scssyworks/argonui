var path = require('path');
var xmlBuilder = require('xmlbuilder');
const config = require('../config.json');

/**
 * @param  {Object}   params
 * @param  {Function} callback
 */
module.exports = function (params, callback) {
  'use strict';

  var options = params.context;
  var grunt = params.grunt;

  var aemuxlib = options.aemuxlib || {};
  var pages = options.pages;
  var page = options.page;

  var async = grunt.util.async;

  aemuxlib.dest = aemuxlib.dest || page.filePair.orig.dest + '/tmp';
  aemuxlib.contentSection = aemuxlib.contentSection || '';
  aemuxlib.wrapJsonData = aemuxlib.wrapJsonData || false;

  function buildComponentContentDescriptor(component) {
    var content = {
      'jcr:root': {
        '@xmlns:cq': "http://www.day.com/jcr/cq/1.0",
        '@xmlns:jcr': "http://www.jcp.org/jcr/1.0",
        '@xmlns:sling': "http://sling.apache.org/jcr/sling/1.0",
        '@jcr:primaryType': "cq:Component",
        '@jcr:title': component,
        '@allowedParents': "[*/parsys]",
        '@componentGroup': ".hidden"
      }
    };

    var xml = xmlBuilder.create(content);
    return xml.end({ pretty: true, indent: '  ', newline: '\n' });
  }

  function buildDemoRootPageContentDescriptor(title) {
    var content = {
      'jcr:root': {
        '@xmlns:cq': "http://www.day.com/jcr/cq/1.0",
        '@xmlns:jcr': "http://www.jcp.org/jcr/1.0",
        '@xmlns:sling': "http://sling.apache.org/jcr/sling/1.0",
        '@xmlns:nt': "http://www.jcp.org/jcr/nt/1.0",
        '@jcr:primaryType': "cq:Page",
        '@jcr:title': title,
        'jcr:content': {
          '@cq:designPath': aemuxlib.designJcrPath,
          '@jcr:primaryType': "nt:unstructured",
          '@jcr:title': title
        }
      }
    };

    var xml = xmlBuilder.create(content);
    return xml.end({ pretty: true, indent: '  ', newline: '\n' });
  }

  function buildDemoPageContentDescriptor(title, componentPath) {
    var content = {
      'jcr:root': {
        '@xmlns:cq': "http://www.day.com/jcr/cq/1.0",
        '@xmlns:jcr': "http://www.jcp.org/jcr/1.0",
        '@xmlns:sling': "http://sling.apache.org/jcr/sling/1.0",
        '@xmlns:nt': "http://www.jcp.org/jcr/nt/1.0",
        '@jcr:primaryType': "cq:Page",
        '@jcr:title': title,
        'jcr:content': {
          '@jcr:primaryType': "nt:unstructured",
          '@jcr:title': title,
          '@sling:resourceType': componentPath,
          '@pageTitle': title
        }
      }
    };
    var xml = xmlBuilder.create(content);
    return xml.end({ pretty: true, indent: '  ', newline: '\n' });
  }

  //create demo content root
  grunt.file.mkdir(aemuxlib.contentRoot);
  grunt.file.write(path.join(aemuxlib.contentRoot, ".content.xml"), buildDemoRootPageContentDescriptor(config.aem.uxContentDescriptor));

  async.forEachSeries(pages, function (file, next) {
    if (page.src !== file.src) { next(); return; }
    //create demo component for pages and component in the uxlib
    grunt.verbose.ok('Generating content descriptor for: '.yellow + file.dest);
    var jcrComponentContentFile = path.join(path.dirname(file.dest), '.content.xml');
    grunt.file.write(jcrComponentContentFile, buildComponentContentDescriptor(file.basename));

    var dataJson = grunt.file.expand({ matchBase: true }, path.dirname(file.src) + path.sep + '*.json');
    for (var i = 0; i < dataJson.length; i++) {
      var dataJsonFile = dataJson[i];
      if (aemuxlib.wrapJsonData) {
        grunt.file.copy(dataJsonFile,
          path.join(path.dirname(file.dest),
            path.basename(dataJsonFile, '.json')) + '.js', {
            process: function (content) {
              return "use(function() {\n"
                + " var data = " + content + ";\n"
                + "data.requestURI = request.requestURI;\n"
                + "data.nodePathWithSelector = resource.path + '.ux-preview.html';\n"
                + "data.pagePathWithSelector = resource.path + '.ux-preview.html';\n"
                + " return data;\n"
                + "\n});"
            }
          });
      } else {
        grunt.file.copy(dataJsonFile, path.join(path.dirname(file.dest), path.basename(dataJsonFile, '.json')) + '.json');
      }
    }
    //demo content
    var componentResourcePath = file.dest.replace(aemuxlib.jcrFileRoot, '/');
    var componentSlingResource = path.dirname(componentResourcePath);
    var pageName = path.basename(path.dirname(file.src));
    if (file.basename == "ux-components" || file.basename == "ux-pages") {
      pageName = file.basename;
    }
    var demoPageFolder = path.join(aemuxlib.contentRoot, aemuxlib.contentSection, pageName);
    grunt.file.mkdir(demoPageFolder);
    grunt.file.write(path.join(demoPageFolder, '.content.xml'), buildDemoPageContentDescriptor(file.basename, componentSlingResource));
    next();
  }, function () {
    callback();
  });


};
