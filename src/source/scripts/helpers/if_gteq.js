/**
 * Compares if first value is greater than or equals second value
 *
 * Usage:
 *
 * {{#if_gteq value1 value2}}
 *   ...
 * {{/if_gteq}}
 */

export default function (first, second, options) {
  if (first >= second) {
    return options.fn(this);
  }
  return options.inverse(this);
}
