import Handlebars from 'handlebars';
/**
 * converts camel case to dashed lowercase
 * @param {string} key Object key
 */
function _hiphenate(key) {
  if (typeof key === 'string') {
    key = key.replace(/[A-Z]/g, (match) => {
      if (match) {
        return `-${match.toLowerCase()}`;
      }
      return match;
    });
  }
  return key;
}

export default function (context, options) {
  let out = '';
  let data = null;
  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }
  if (
    context
    && typeof context === 'object'
    && !Array.isArray(context) // Helper does not work for arrays
  ) {
    const objectKeys = Object.keys(context);
    objectKeys.forEach((key, index) => {
      let hiphenatedKey = _hiphenate(key);
      while (hiphenatedKey.charAt(0) === '-') {
        hiphenatedKey = hiphenatedKey.substring(1);
      }
      hiphenatedKey = `data-${hiphenatedKey}`;
      if (data) {
        data.key = hiphenatedKey;
        data.index = index;
        data.count = index + 1;
        data.first = index === 0;
        data.last = index === objectKeys.length - 1;
      }
      out += options.fn(context[key], { data });
    });
  }
  return out;
}
