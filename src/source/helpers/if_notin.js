function _sanitize(str) {
  if (typeof str === 'string') {
    return str.trim();
  }
}

module.exports.register = function (Handlebars) {
  'use strict';
  Handlebars.registerHelper('if_notin', function (itemListStr, item, opts) {
    if (typeof itemListStr === 'string') {
      var itemList = itemListStr.split(',').map(_sanitize);
      if (!~itemList.indexOf(item)) {
        return opts.fn(this);
      }
    }
    return opts.inverse(this);
  });
};

module.exports.sanitize = _sanitize;
