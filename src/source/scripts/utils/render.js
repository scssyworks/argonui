import 'core-js/features/array/includes';
import $ from 'jquery';
import deparam from 'jquerydeparam';
import { throwError, parseJson, isValidSelector } from '../common/common';
import { ajaxWrapper } from '../utils/ajax';
import { templates } from './templates';
import { logger } from './logger';
import { PARSE_ERROR, INVALID_OBJECT, INVALID_URL, TEMPLATE_MISSING } from './constants';
import { $body } from './commonSelectors';

const $rootTemplate = $('.js-render-content');

/**
 * Render JS is a wrapper for handlebars template
 * @author Sachin Singh
 * @date 12-06-2019
 */


/**
 * Resolves URL and data for ajaxWrapper
 * @param {object} ajaxConfig
 * @param {object|string} urlOb
 */
function _resolveUrlAndData(ajaxConfig, urlOb) {
  let urlParts = null;
  if (typeof urlOb === 'string') {
    urlParts = urlOb.split('?');
    ajaxConfig.pathObject = {};
    ajaxConfig.pathObject.path = ajaxConfig.url = urlParts[0];
    if (urlParts.length === 2) {
      ajaxConfig.pathObject.data = ajaxConfig.data = urlParts[1];
    }
    ajaxConfig.pathObject.id = ajaxConfig.dataId = ajaxConfig.url;
    return;
  } else if (urlOb && typeof urlOb === 'object') {
    if (typeof urlOb.path === 'string') {
      ajaxConfig.url = urlOb.path;
      if (urlOb.data) {
        ajaxConfig.data = urlOb.data;
      }
      ajaxConfig.dataId = urlOb.id = urlOb.id || urlOb.path;
      ajaxConfig.pathObject = urlOb;
      return;
    }
  }
  throwError(INVALID_URL);
}

/**
 * Sets response data and headers in data object
 * @param {Object} dataObject
 * @param {string} currentId
 * @param {Object} req
 */
function _setRequestDataAndHeaders(dataObject, currentId, req) {
  currentId = Array.isArray(currentId) ? currentId : [currentId];
  if (!dataObject.requestHeader) {
    dataObject.requestHeader = {};
  }
  if (!('length' in dataObject)) {
    dataObject.length = 0;
  }
  currentId.forEach(id => {
    dataObject[id] = req.data;
    dataObject.requestHeader[id] = {
      url: req.url,
      requestData: req.requestData,
      pathObject: req.pathObject
    };
    dataObject.length += 1;
  });
  return dataObject;
}

/**
 * Returns an object of data for multiple ajax requests
 * @param {object} completedReq
 */
function _combineResults(completedReq) {
  const dataObject = {};
  dataObject.requestHeader = {};
  completedReq.forEach(req => {
    if (!req.aborted) {
      _setRequestDataAndHeaders(dataObject, req.id, req);
    }
  });
  return dataObject;
}

/**
 * Returns valid data ids
 * @param {Object} originalData
 */
function _getDataIds(originalData) {
  if (originalData) {
    const keys = Object.keys(originalData);
    return keys.filter(key => (!['requestHeader', 'length'].includes(key)));
  }
  return [];
}

/**
 * Extracts render data if only once request is made
 * @param {Object} originalData
 */
function _setCurrentData(originalData) {
  const dataIds = _getDataIds(originalData);
  if (dataIds.length === 1) {
    return originalData[dataIds[0]];
  }
  return originalData;
}

/**
 * Renders JSON data passed or picked from code blocks
 * @param {object} config
 */
function _renderData(config) {
  const codeBlock = $(config.codeBlock).first();
  let renderTarget = null;
  let counter = 0;
  let dataIds = null;
  let sendOriginalData = false;
  if (!config.data && codeBlock.length) {
    // If data is not passed, then codeBlock present on page will be referred
    try {
      config.data = JSON.parse(codeBlock.text());
      config.target = codeBlock.data('target');
    } catch (e) {
      throwError(PARSE_ERROR);
    }
  }
  // Check if multiple targets are passed
  if (config.target && !isValidSelector(config.target)) {
    // Recursively render data
    dataIds = _getDataIds(config.originalData);
    if (dataIds.length === 0) {
      // This scenario occurs when data request is not send
      // Consider data sent directly in configuration
      dataIds = Array.isArray(config.dataId) ? config.dataId : [config.dataId];
    }
    // Render only valid data ids
    $.each(dataIds, () => {
      const id = arguments[1];
      counter += 1;
      _renderData($.extend({}, config, {
        template: ((config.template && config.template[id]) ? config.template[id] : config.template),
        target: config.target[id],
        originalTarget: config.target,
        data: ((config.originalData && config.originalData[id]) || null),
        dataId: id,
        executeCallbacks: (counter === dataIds.length)
      }));
    });
    return;
  }
  config.data = parseJson(config.data);
  sendOriginalData = (typeof config.executeCallbacks === 'boolean');
  config.executeCallbacks = (typeof config.executeCallbacks === 'undefined') || config.executeCallbacks;
  // Call beforeRender method for any pre-processing before render
  if (typeof config.beforeRender === 'function') {
    config.beforeRender.apply(config, [config.data, config.dataId]);
    $body.trigger('render.before', [config]);
  }
  if (config.render) {
    renderTarget = $(config.target);
    // Resolve render target
    if (!renderTarget.length) {
      renderTarget = $('<div>');
      if ($rootTemplate.length) {
        $rootTemplate.removeClass('d-none').append(renderTarget);
      } else if (codeBlock.length) {
        codeBlock.after(renderTarget);
      } else {
        $body.append(renderTarget);
      }
    }
    // If render target needs to be hidden, then add 'd-none' class to the target
    if (config.hidden) {
      renderTarget.addClass('d-none');
    } else {
      renderTarget.removeClass('d-none');
    }
    // Render template in target element
    try {
      const jQueryFn = config.append ? 'append' : 'html';
      if (templates[config.template]) {
        renderTarget[jQueryFn](templates[config.template](config.data));
      } else {
        logger.debug(`[${config.template}]: ${TEMPLATE_MISSING}`);
        renderTarget[jQueryFn](JSON.stringify(config.data, null, 4));
      }
    } catch (e) {
      logger.error(PARSE_ERROR);
    }
    // Callback is called regardless of render flag, so that developer has full control over API
    if (config.callback && config.executeCallbacks) {
      if (sendOriginalData) {
        const idList = [];
        if (isValidSelector(config.originalTarget)) {
          $(config.originalTarget).trigger('render.complete', [config]);
        } else if (config.originalTarget && typeof config.originalTarget === 'object') {
          $.each(config.originalTarget, (id, target) => {
            idList.push(id);
            config.target = target;
            $(target).trigger('render.complete', [config]);
          });
        }
        config.callback.apply(config.originalTarget, [config.originalData, idList]);
      } else {
        renderTarget.trigger('render.complete', [config]);
        config.callback.apply(renderTarget, [config.data, config.dataId]);
      }
    }
  }
}

/**
 * Curry function that resolves beforeSend method
 * @param {Function} beforeSend
 * @param {Object} xhrCache
 */
function _getBeforeSend(beforeSend, xhrCache) {
  return function (jqXHR) {
    if (typeof beforeSend === 'function') {
      beforeSend.apply(this, arguments);
    }
    xhrCache.push({
      jqXHR: jqXHR,
      done: false
    });
  };
}

/**
 * Resolves loader elements for ajax requests
 * @param {Object} ajaxConfig
 * @param {Object} config
 * @param {string} url
 */
function _resolveLoader(ajaxConfig, config, url) {
  if (!ajaxConfig.loader && ajaxConfig.showLoader) {
    if (isValidSelector(config.target)) {
      ajaxConfig.loader = $(config.target);
    } else if (typeof config.target === 'object') {
      $.each(config.target, (id, target) => {
        if (typeof url.id === 'string' && url.id === id) {
          ajaxConfig.loader = $(target);
        } else if (Array.isArray(url.id) && url.id.includes(id)) {
          if (!ajaxConfig.loader) {
            ajaxConfig.loader = $(target);
          } else {
            ajaxConfig.loader = ajaxConfig.loader.add($(target));
          }
        }
      });
    }
  }
}

/**
 * Filters XHR status
 * @param {*} data
 * @param {string} textStatus
 * @param {Object|string} jqXHR
 */
function _getStatus(data, textStatus, jqXHR) {
  return this.filter(ob => {
    if (textStatus === 'success') {
      return (ob.jqXHR === jqXHR);
    }
    // For error cases XHR object is received in data field
    return (ob.jqXHR === data);
  })[0];
}

/**
 * Sets XHR data
 * @param {Object} jqXHRObj
 * @param {string} textStatus
 */
function _setXHRData(jqXHRObj, data, textStatus) {
  if (this) {
    if (this.url) {
      jqXHRObj.url = this.url.split('?')[0];
      jqXHRObj.requestData = deparam(this.url.split('?')[1]);
    }
    jqXHRObj.id = this.dataId;
    if (Array.isArray(this.dataId)) {
      jqXHRObj.dataIdStr = this.dataId.join(',');
    } else {
      jqXHRObj.dataIdStr = this.dataId;
    }
    if (this.pathObject) {
      jqXHRObj.pathObject = this.pathObject;
    }
  }
  jqXHRObj.done = true;
  if (textStatus === 'success') {
    jqXHRObj.data = data;
    return true;
  } else if (textStatus === 'abort') {
    jqXHRObj.aborted = true;
  }
  jqXHRObj.error = true;
  jqXHRObj.data = null;
  return false;
}

/**
 * Resolves targets for XHR requests
 * @param {Object} config
 * @param {Object} jqXHRObj
 */
function _resolveTargets(config, jqXHRObj) {
  let customConfig = null;
  let id = jqXHRObj.id;
  if (config.target && !isValidSelector(config.target)) {
    if (Array.isArray(id) && id.length === 1) {
      // Convert id to string by assigning first value
      id = id[0];
    }
    // If id is still an array: it means that there were more than one ids
    if (Array.isArray(id)) {
      customConfig = $.extend({}, config, {
        target: {}
      });
      $.each(config.target, key => {
        if (id.includes(key)) {
          customConfig.target[key] = config.target[key];
        }
      });
    } else {
      // Resolve appropriate target for given id
      customConfig = $.extend({}, config, {
        target: config.target[id]
      });
    }
  }
  return customConfig;
}

/**
   * Sends ajax calls and combine results to render components
   * @param {object} config
   */
function _renderAjax(config) {
  config.url = (Array.isArray(config.url)) ? config.url : [config.url];
  const ajaxConfig = $.extend({}, config.ajaxConfig);
  const xhrCache = [];
  const validUrls = [];
  let sendReq = false;
  ajaxConfig.beforeSend = _getBeforeSend(ajaxConfig.beforeSend, xhrCache);
  config.url.forEach(url => {
    if (typeof url === 'string') {
      sendReq = true;
    } else {
      sendReq = url.send = (typeof url.send === 'undefined') || url.send;
    }
    _resolveUrlAndData(ajaxConfig, url);
    _resolveLoader(ajaxConfig, config, url);
    if (sendReq) {
      validUrls.push(url);
      ajaxWrapper.getXhrObj(ajaxConfig)
        .always(function (data, textStatus) {
          // Resolve pending requests
          const jqXHRObj = _getStatus.apply(xhrCache, arguments);
          if (jqXHRObj) {
            if (_setXHRData.apply(this, [jqXHRObj, data, textStatus])) {
              $body.trigger('renderajax.success', [data, config]);
            } else {
              $body.trigger('renderajax.failed', [null, config]);
            }
          }
          if (config.merge) {
            // Check if all requests are completed
            const completedReq = xhrCache.filter(ob => ob.done);
            if (completedReq.length === validUrls.length) {
              // call callback method with resolved data combined together
              config.originalData = _combineResults(completedReq);
              config.data = _setCurrentData(config.originalData);
              // If only 1 request is processed then preset dataId
              if (config.originalData.length === 1) {
                config.dataId = completedReq[0].dataIdStr;
              }
              // Render results
              _renderData(config);
              // Clear xhr cache for next query
              xhrCache.length = 0;
            }
          } else if (!jqXHRObj.aborted) {
            config.data = jqXHRObj.data;
            config.originalData = _setRequestDataAndHeaders({}, jqXHRObj.id, jqXHRObj);
            if (config.originalData.length === 1) {
              config.dataId = jqXHRObj.dataIdStr;
            }
            let customConfig = null;
            customConfig = _resolveTargets(config, jqXHRObj);
            if (typeof config.template === 'object' && config.template !== null) {
              customConfig = $.extend({}, config, customConfig, {
                template: config.template[jqXHRObj.id]
              });
            }
            _renderData(customConfig || config);
          }
        });
    } else if (!config.merge) {
      config.data = null;
      config.dataId = url.id;
      _renderData(config);
    }
  });
}

/**
 * Checks the type of rendering to be executed
 * @param {object} config
 */
function _render(config) {
  if (config.type === 'ajax') {
    _renderAjax(config);
  } else {
    _renderData(config);
  }
}

/**
   * External function to render template and data
   * @param {string|object} template
   * @param {object|string} data
   * @param {string} target
   * @param {function} callback
   */
function _fn(template, data, target, callback) {
  const config = {
    type: 'page',
    render: true
  };
  if (typeof template === 'string') {
    config.template = template;
    config.data = data;
    config.target = target;
    config.callback = callback;
  } else if (typeof template === 'object') {
    $.extend(config, template);
    if (typeof data === 'function') {
      callback = data;
      data = undefined;
    } else if (typeof target === 'function') {
      callback = target;
      target = undefined;
    }
    config.callback = callback;
  } else {
    throwError(INVALID_OBJECT);
  }
  if (config.url) {
    config.type = 'ajax';
  }
  _render(config);
}

export const render = {
  /**
   * Renders template
   */
  fn() {
    return _fn.apply(this, arguments);
  },
  /**
   * Gets template body
   * @param {string} name Template name
   */
  get(name) {
    return templates[name];
  }
};
