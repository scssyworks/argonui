import Handlebars from 'handlebars';
import 'core-js/features/string/starts-with';

export default function (context, options) {
  let data = null;
  let out = '';
  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }
  if (context && typeof context === 'object') {
    const objectKeys = Object.keys(context);
    objectKeys.forEach((key, index) => {
      if (key.startsWith('data-')) {
        if (data) {
          data.key = key;
          data.index = index;
          data.count = index + 1;
          data.first = index === 0;
          data.last = index === objectKeys.length - 1;
        }
        out += options.fn(context[key], { data });
      }
    });
  }
  return out;
}
