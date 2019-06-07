/**
 * Process dynamic media images
 * @author Sachin Singh
 * @date 16-02-2019
 */

import $ from 'jquery';
import LazyLoad from 'vanilla-lazyload';

function _processImageAttributes(container) {
  $('.js-dynamic-media').each(function () {
    const $this = $(this);
    let desktopSrc = $this.attr('data-src_desktop');
    let mobileLandSrc = $this.attr('data-src_mobilel');
    let mobilePortSrc = $this.attr('data-src_mobilep');

    if (typeof desktopSrc !== 'undefined') {
      if (typeof mobileLandSrc === 'undefined') {
        mobileLandSrc = desktopSrc;
      }
      if (typeof mobilePortSrc === 'undefined') {
        mobilePortSrc = mobileLandSrc;
      }
    }

    if (
      window.matchMedia('(max-width: 414px)').matches
      || window.matchMedia('(max-width: 414px) and (-webkit-min-device-pixel-ratio: 2), (max-width: 414px) and (min-resolution: 192dpi), (max-width: 414px) and (min-resolution: 2dppx)').matches
    ) {
      // mobile portrait
      $this.attr('data-src', mobilePortSrc);
    } else if (
      window.matchMedia('(min-width: 415px) and (max-width: 1023px)').matches
      || window.matchMedia('(min-width: 415px) and (max-width: 1023px) and (-webkit-min-device-pixel-ratio: 2), (min-width: 415px) and (max-width: 1023px) and (min-resolution: 192dpi), (min-width: 415px) and (max-width: 1023px) and (min-resolution: 2dppx)').matches
    ) {
      // mobile landscape
      $this.attr('data-src', mobileLandSrc);
    } else {
      //desktop xtra large
      $this.attr('data-src', desktopSrc);
    }
  });
  if (typeof container === 'string') {
    return new LazyLoad({
      container: document.querySelector(container),
      elements_selector: '.js-dynamic-media[data-src]'
    });
  }
  return new LazyLoad({
    elements_selector: '.js-dynamic-media[data-src]'
  });
}

export default {
  bindEvents() {
    $(window).on('resize orientationchange', () => {
      this.processImageAttributes();
    });
  },
  processImageAttributes() {
    return _processImageAttributes.apply(this, arguments);
  },
  init() {
    this.bindEvents();
    this.processImageAttributes();
  }
};
