/**
 * Compares if first value is greater than second value
 *
 * Usage:
 *
 * {{#if_gt value1 value2}}
 *   ...
 * {{/if_gt}}
 */

export default function (first, second, options) {
  if (first > second) {
    return options.fn(this);
  }
  return options.inverse(this);
}
