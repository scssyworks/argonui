import { loader, isCallable } from '../common/common';
import $ from 'jquery';
import { ajaxMethods } from './constants';

/**
 * Curry to resolve before send
 * @param {object} self Current context
 * @param {object} ajaxOptions Ajax options
 * @param {function} beforeSendCache Before send function
 */
function _getBeforeSend(self, ajaxOptions, beforeSendCache) {
  return function (jqXHR) {
    if (ajaxOptions.cancellable) {
      if (self.xhrPool[ajaxOptions.url]) {
        self.xhrPool[ajaxOptions.url].abort();
        self.xhrPool[ajaxOptions.url] = jqXHR;
      } else {
        self.xhrPool[ajaxOptions.url] = jqXHR;
      }
    }
    if (ajaxOptions.loader && ajaxOptions.loader.length) {
      // Check if target type is a button or link
      ajaxOptions.loader.addClass('loading');
      if (ajaxOptions.loader.hasClass(self.loaderClasses.loaderBtn)) {
        self.loaderRef = loader().insertAfter(ajaxOptions.loader);
      } else if (ajaxOptions.loader.hasClass(self.loaderClasses.loaderAppend)) {
        self.loaderRef = loader().appendTo(ajaxOptions.loader);
      } else {
        self.loaderRef = loader().target(ajaxOptions.loader);
      }
    }
    if (typeof beforeSendCache === 'function') {
      beforeSendCache.apply(this, arguments);
    }
  };
}

/**
 * Callback method to be called once AJAX is successful
 * @param {object} self current reference
 * @param {function} callback callback to be called when ajax is completed
 * @param {*} data received data from backend
 * @param {string} status text status of current ajax call
 * @param {object} jqXHR jQuery xhr object
 */
function _done(self, callback, data, status, jqXHR) {
  $.each(self.xhrPool, function (url, xhrObj) {
    if (xhrObj === jqXHR) {
      delete self.xhrPool[url];
      return false;
    }
  });
  if (isCallable(callback)) {
    return callback.apply(this, arguments);
  }
  return;
}


/**
 * Callback method to be called once AJAX is failed
 * @param {object} self current reference
 * @param {function} callback callback to be called when ajax failed
 * @param {object} jqXHR jQuery xhr object
 */
function _fail(self, callback, jqXHR) {
  $.each(self.xhrPool, function (url, xhrObj) {
    if (xhrObj === jqXHR) {
      delete self.xhrPool[url];
      return false;
    }
  });
  if (isCallable(callback)) {
    return callback.apply(this, arguments);
  }
  return;
}

/**
 * Callback method to be called once AJAX is completed
 * @param {Object} self current reference
 * @param {Function} complete callback to be called once ajax request is completed
 */
function _always(self, complete) {
  if (self.loaderRef && self.loaderRef.length) {
    self.loaderRef.remove();
  }
  if (this.loader && this.loader.length) {
    this.loader.removeClass('loading');
  }
  if (isCallable(complete)) {
    return complete.apply(this, arguments);
  }
  return;
}

export const ajaxWrapper = {
  xhrPool: {
    name: 'xhrPool'
  },
  loaderClasses: {
    loaderAppend: 'loader-append',
    loaderBtn: 'loader-btn'
  },
  getXhrObj: function getXhrObj(options, callback, complete) {
    var self = this,
      ajaxOptions = {},
      defaultOptions = {
        method: ajaxMethods.POST,
        async: true,
        cache: false,
        url: '',
        data: {},
        loaderRef: null,
        // By default allow multiple request on one URL
        cancellable: false,
        // Specify a target element where loader needs to be shown
        loader: null
      };
    ajaxOptions = $.extend({}, defaultOptions, options);
    const { url: apiUrl } = ajaxOptions;
    if (
      typeof apiUrl === 'string'
      && (/jsonData/).test(apiUrl)
      && (/\.json$/).test(apiUrl)
    ) {
      ajaxOptions.method = 'GET';
    }
    options.loader = undefined;
    var beforeSendCache = ajaxOptions.beforeSend;
    ajaxOptions.beforeSend = _getBeforeSend(self, ajaxOptions, beforeSendCache);
    return $.ajax(ajaxOptions).done(function () { // eslint-disable-line
      _done.apply(this, [self, callback, ...arguments]);
    }).fail(function () {
      _fail.apply(this, [self, callback, ...arguments]);
    }).always(function () {
      _always.apply(this, [self, complete, ...arguments]);
    });
  }
};
