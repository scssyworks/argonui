/**
 * Helper to render rich text html in safe context
 *
 * Usage:
 *
 * {{rte <variable or string>}}
 */

import sanitizeHtml from 'sanitize-html';
import Handlebars from 'handlebars';

const cache = {};
const allowedTags = sanitizeHtml.defaults.allowedTags.concat(['img', 'sup', 'sub', 'span']);
const allowedAttr = sanitizeHtml.defaults.allowedAttributes;
const allowedSchemes = sanitizeHtml.defaults.allowedSchemes.concat(['tel']);
allowedAttr.img = ['src', 'alt'];
allowedTags.forEach(tag => {
  allowedAttr[tag] = Array.isArray(allowedAttr[tag]) ? allowedAttr[tag] : [];
  allowedAttr[tag].push('class', 'id', 'data-*');
});

function getConfig() {
  cache.config = cache.config || {
    allowedTags,
    allowedSchemes,
    allowedAttributes: allowedAttr
  };
  return cache.config;
}

export default function (htmlText) {
  const cleanHtml = sanitizeHtml(htmlText, getConfig());
  return new Handlebars.SafeString(cleanHtml);
}
