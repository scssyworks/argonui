const config = require('../config.json');
module.exports = function (grunt) {
  var Pusher = require('aemsync').Pusher
  var path = require('path');

  grunt.registerMultiTask('aemdeploy', 'Deploy content to AEM using aemsync', function () {
    var done = this.async();

    var options = this.options({
      targets: [config.server]
    });

    grunt.log.writeln("Aemsync targets: ", options.targets.join(','));
    var pusher = new Pusher(options.targets, 0, function (err) {
      if (err) {
        grunt.log.ok(err);
      }
      done();
    });

    this.filesSrc.forEach(function (file) {
      pusher.addItem(path.resolve(file));
    });

    if (this.filesSrc.length) {
      pusher.processQueue();
    } else {
      pusher.onPushEnd('Files do not exist yet!');
    }
    grunt.log.ok("Files processed: " + this.filesSrc.length);
  });
}
