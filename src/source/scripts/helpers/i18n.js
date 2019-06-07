/**
 * Resolves i18n key and value
 *
 * Usage:
 *
 * {{i18n key="<i18n key>"}}
 */

import Handlebars from 'handlebars';
import { getI18n } from '../common/common';

export default function (options) {
  const key = options.hash.key;
  const replaceList = options.hash.replaceList;
  let replaceListArr = [];
  if (typeof replaceList === 'string') {
    replaceListArr = replaceList.split(',').map(replacement => Handlebars.escapeExpression(replacement.trim()));
  } else if (Array.isArray(replaceList)) {
    replaceListArr = replaceList;
  }
  if (replaceListArr.length) {
    return new Handlebars.SafeString(getI18n(key, replaceListArr, options.hash));
  }
  return new Handlebars.SafeString(getI18n(key, options.hash));
}
