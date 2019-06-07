import 'core-js/features/array/includes';
import 'core-js/features/number/parse-int';
import 'core-js/features/object/assign';
import LZStorage from 'lzstorage';
import $ from 'jquery';
import { IS_MOBILE_REGEX, IS_TABLET_REGEX } from '../utils/constants';
import { $global } from '../utils/commonSelectors';
import { templates } from '../utils/templates';
import Handlebars from 'handlebars';

const currentUserAgent = window.navigator.userAgent;

// Initialize storage utility
export const storageUtil = new LZStorage();

// Initialize functions for user agent detection
/**
 * Checks if current user agent belongs to mobile
 */
export const isMobile = () => IS_MOBILE_REGEX.test(currentUserAgent);

/**
 * Checks if current user agent belongs to tablet
 */
export const isTablet = () => IS_TABLET_REGEX.test(currentUserAgent);

/**
 * Checks if current user agent belongs to desktop
 */
export const isDesktop = () => !(isMobile() || isTablet());

/**
 * Checks if current screen mode is mobile
 */
export const isMobileMode = () => ($(window).outerWidth() < 1024);

/**
 * Checks if current screen mode is desktop
 */
export const isDesktopMode = () => !isMobileMode();

/**
 * Checks if author mode is enabled
 */
export const isAuthorMode = () => {
  const wcmmode = storageUtil.getCookie('wcmmode');
  return ['edit', 'preview', 'design'].includes(wcmmode);
};

/**
 * Checks if given param is callable
 * @param {*} param Any param
 */
export const isCallable = (param) => (typeof param === 'function');

/**
 * Scrolls the page to a particular element
 * @param {string|object} selector Selector or element
 * @param {number} duration Duration in number
 * @param {function} callback Callback function
 */
export const scrollToElement = (selector = document.body, duration = 500, callback) => {
  let executed = false;
  $global.animate(
    {
      scrollTop: $(selector).offset().top
    },
    {
      duration,
      complete() {
        if (!executed) {
          executed = true;
          if (isCallable(callback)) {
            callback.apply(this, arguments);
          }
        }
      }
    }
  );
};

/**
 * Scrolls the page to given offset location
 * @param {number} offset Offset from top
 * @param {number} duration Duration in number
 * @param {function} callback Callback function
 */
export const scrollToOffset = (offset, duration = 500, callback) => {
  let executed = false;
  $global.animate(
    {
      scrollTop: offset
    },
    {
      duration,
      complete() {
        if (!executed) {
          executed = true;
          if (isCallable(callback)) {
            callback.apply(this, arguments);
          }
        }
      }
    }
  );
};

/**
 * Scrolls the page to top
 * @param {number} duration Duration in number
 * @param {function} callback Callback function
 */
export const scrollToTop = (duration = 500, callback) => {
  scrollToOffset(0, duration, callback);
};

/**
 * Loader class to automatically insert loading animation through code
 */
export class Loader {
  constructor(loader) {
    this.context = $(loader);
    this.length = this.context.length;
    if (this.length) {
      this.htmlText = this.context[0].outerHTML;
      this[0] = this.context[0];
    }
  }
  target(el) {
    if (this.length) {
      $(el).html(this.context);
    }
    return this;
  }
  appendTo(el) {
    if (this.length) {
      $(el).append(this.context);
    }
    return this;
  }
  prependTo(el) {
    if (this.length) {
      $(el).prepend(this.context);
    }
    return this;
  }
  insertAfter(el) {
    if (this.length) {
      $(el).after(this.context);
    }
    return this;
  }
  insertBefore(el) {
    if (this.length) {
      $(el).before(this.context);
    }
    return this;
  }
  remove() {
    return this.context.remove();
  }
}

/**
 * Returns a loader object with default template
 * @param {object} target Target where loader needs to be placed
 * @param {boolean} appendMode Append mode
 */
export const loader = (target, appendMode) => {
  const loading = templates.loader();
  if (target) {
    $(target)[appendMode ? 'append' : 'html'](loading);
  } else {
    return new Loader(loading);
  }
};

/**
 * Replaces placeholders in query string with values
 * @param {string} queryString Query string
 * @param {any[]|object} replaceMap Replacement list or map
 */
export const resolveQuery = (queryString, replaceMap) => {
  // Replace the replaceable data
  if (Array.isArray(replaceMap)) {
    replaceMap.forEach(function (value, index) {
      var keyRegex = new RegExp('\\{' + index + '\\}', 'g');
      queryString = queryString.replace(keyRegex, value);
    });
  } else if (typeof replaceMap === 'object' && replaceMap !== null) {
    Object.keys(replaceMap).forEach(function (key) {
      var keyRegex = new RegExp('\\{' + key + '\\}', 'g');
      queryString = queryString.replace(keyRegex, replaceMap[key]);
    });
  }
  return queryString;
};

/**
 * Returns the value of i18n key
 * @param {string} key I18n key
 * @param {string[]} replaceList Variable replacement list
 * @param {object} hash Helper hash object
 */
export const getI18n = (key, replaceList, hash) => {
  let variables = [];
  if (!Array.isArray(replaceList)) {
    hash = replaceList;
    replaceList = [];
  }
  if (hash && typeof hash.replaceKeys === 'string') {
    variables = hash.replaceKeys.split(',');
    key = resolveQuery(key, variables);
  }
  if (window.Granite && window.Granite.I18n) {
    return window.Granite.I18n.get(key, replaceList);
  }
  return key;
};

/**
 * Wrapper to throw a generic error
 * @param {string} message Error message
 */
export const throwError = (message) => {
  throw new Error(message);
};

/**
 * Parse JSON string if it is parsable. Otherwise returns the original string.
 * @param {string} jsonData JSON string
 */
export const parseJson = (data) => {
  let parsedData = data;
  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      parsedData = data;
    }
  }
  return parsedData;
};

/**
 * Returns true if current selector is valid
 * @param {string|object|object[]} selector Selector string or object
 */
export const isValidSelector = (selector) => (
  typeof selector === 'string'
  || selector instanceof $
  || selector instanceof Node
  || selector instanceof NodeList
  || selector instanceof HTMLCollection
  || Array.isArray(selector)
);

/**
 * Sanitize input value to prevent XSS
 * @param {any} input Input value
 */
export const sanitize = (input) => Handlebars.escapeExpression(input);


/**
 * sort table data
 * @param {object} data data object
 * @param {string[]} keys List of keys
 * @param {dataLink} dataLink Row link
 */
export const tableSort = (data, keys, dataLink) => {
  const dataObject = {
    row: []
  };

  if (dataLink) {
    dataObject.rowLink = `${dataLink}`;
  }

  keys.forEach((key, index) => {
    const value = data[key];
    dataObject.row[index] = {
      key,
      value,
      isRTE: [''].includes(key)
    };
  });
  return dataObject;
};
