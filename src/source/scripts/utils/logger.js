import deparam from 'jquerydeparam';
import { isHeadlessChrome } from './browserDetect';

const currentHost = window.location.hostname;
const currentParams = deparam(window.location.search);

const _shouldLog = () => (
  (
    (
      currentHost === 'localhost'
      || currentHost === '127.0.0.1'
    )
    || currentParams.debug
    || currentParams.debugClientLibs
  )
  && typeof console !== 'undefined'
  && !isHeadlessChrome()
);

export const logger = {
  log(...args) {
    if (_shouldLog()) {
      console.log(...args); // eslint-disable-line
    }
  },
  error(...args) {
    if (_shouldLog()) {
      console.error(...args); // eslint-disable-line
    }
  },
  debug(...args) {
    if (_shouldLog()) {
      console.debug(...args); // eslint-disable-line
    }
  }
};
