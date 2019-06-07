import $ from 'jquery';
import { mediaTypes, orientationTypes } from './constants';

/**
 * responsive.js
 * The file implements responsive events for JavaScript
 * @project   ArgonUI
 * @date      2019-05-27
 * @author    Sachin
 * @dependencies jQuery, matchMedia
 */

let currentMedia = null;
let currentMediaWithOrientation = null;

/**
 * Gets orientation of device
 * @returns {string} orientation
 */
function _getOrientation() {
  if (window.matchMedia('(orientation: portrait)').matches) {
    return orientationTypes.PORTRAIT;
  } else if (window.matchMedia('(orientation: landscape)')) {
    return orientationTypes.LANDSCAPE;
  }
  return orientationTypes.UNSUPPORTED;
}

/**
 * Checks if new media matches current media. If yes then returns true, else returns false and updates the currentMedia
 * @param {Object} newMedia
 * @returns {Boolean} true|false
 */
function _matches(newMedia) {
  if (currentMedia.media === newMedia.media) {
    return true;
  }
  currentMedia = newMedia;
  return false;
}

/**
 * Checks if new media matches current media. If yes then returns true, else returns false and updates the currentMedia
 * @param {Object} newMedia
 * @returns {Boolean} true|false
 */
function _matchesWithOrientation(newMedia) {
  if (
    currentMediaWithOrientation.media === newMedia.media &&
    currentMediaWithOrientation.orientation === newMedia.orientation
  ) {
    return true;
  } else {
    currentMediaWithOrientation = newMedia;
    return false;
  }
}

/**
 * Get's current device media details
 * @returns {Object} media object
 */
function _getMedia() {
  if (
    window.matchMedia('(max-width: 414px)').matches ||
    window.matchMedia('(max-width: 414px) and (-webkit-min-device-pixel-ratio: 2), (max-width: 414px) and (min-resolution: 192dpi), (max-width: 414px) and (min-resolution: 2dppx)').matches ||
    window.matchMedia('(min-width: 415px) and (max-width: 1023px)').matches ||
    window.matchMedia('(min-width: 415px) and (max-width: 1023px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 415px) and (max-width: 1023px) and (min-resolution: 192dpi), (min-width: 415px) and (max-width: 1023px) and (min-resolution: 2dppx)').matches
  ) {
    return {
      media: mediaTypes.MOBILE,
      orientation: _getOrientation()
    };
  }
  return {
    media: mediaTypes.DESKTOP,
    orientation: _getOrientation()
  };
}

/**
 * Gets current orientation
 * @param  {...any} args Arguments
 */
export const getOrientation = (...args) => _getOrientation.apply(this, args);

/**
 * Gets current media
 * @param  {...any} args Arguments
 */
export const getMedia = (...args) => _getMedia.apply(this, args);

/**
 * Namespace for response events
 * @namespace
 */
export const responsive = {
  /**
   * Initializes responsive events
   * @method
   * @memberof responsive
   */
  init() {
    currentMedia = _getMedia();
    currentMediaWithOrientation = _getMedia();
    $(window).on('resize', function () {
      var newMedia = _getMedia();
      if (!_matches(newMedia)) {
        $(window).trigger('media.changed', [newMedia]);
      }
      if (!_matchesWithOrientation(newMedia)) {
        $(window).trigger('mediawithorientation.changed', [newMedia]);
      }
    });
  }
};
