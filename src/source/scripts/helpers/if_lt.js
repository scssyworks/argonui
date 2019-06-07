/**
 * Compares if first value is lesser than second value
 *
 * Usage:
 *
 * {{#if_lt value1 value2}}
 *   ...
 * {{/if_lt}}
 */

export default function (first, second, options) {
  if (first < second) {
    return options.fn(this);
  }
  return options.inverse(this);
}
