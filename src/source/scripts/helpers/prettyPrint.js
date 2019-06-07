/**
 * Prints input JSON into readable HTML format
 */
import Handlebars from 'handlebars';

export default function (json) {
  if (json && typeof json === 'object') {
    return new Handlebars.SafeString(`<pre>${JSON.stringify(json, null, 2)}</pre>`);
  }
  return json;
}
