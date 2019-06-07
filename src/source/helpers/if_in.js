var _sanitize = require('./if_notin').sanitize;

module.exports.register = function (Handlebars) {
  'use strict';
  Handlebars.registerHelper('if_in', function (itemListStr, item, opts) {
    if (typeof itemListStr === 'string') {
      var itemList = itemListStr.split(',').map(_sanitize);
      if (!!~itemList.indexOf(item)) {
        return opts.fn(this);
      }
    }
    return opts.inverse(this);
  });
};
