export default function () {
  let outStr = '';
  for (const arg in arguments) {
    if (typeof arguments[arg] !== 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
}
