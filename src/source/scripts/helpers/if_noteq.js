/**
 * Compares if first value equals than second value
 *
 * Usage:
 *
 * {{#if_noteq value1 value2}}
 *   ...
 * {{/if_noteq}}
 */

export default function (first, second, options) {
  if (first !== second) {
    return options.fn(this);
  }
  return options.inverse(this);
}
