/**
 * Checks for both string and boolean true/false values
 *
 * Usage
 * {{#ifBool <variable or string>}}
 *   ...
 * {{/ifBool}}
 */

export default function (value, options) {
  if (
    (
      typeof value === 'string'
      && value.toLowerCase() === 'true'
    )
    || (
      typeof value === 'boolean'
      && value
    )
  ) {
    return options.fn(this);
  }
  return options.inverse(this);
}
