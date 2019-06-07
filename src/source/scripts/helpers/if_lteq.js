/**
 * Compares if first value is lesser than or equals second value
 *
 * Usage:
 *
 * {{#if_lteq value1 value2}}
 *   ...
 * {{/if_lteq}}
 */

export default function (first, second, options) {
  if (first <= second) {
    return options.fn(this);
  }
  return options.inverse(this);
}
