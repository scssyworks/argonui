import 'core-js/features/array/includes';
import { router } from 'jqueryrouter';

/**
 * Component list with routing
 */
const list = [];

/**
 * Routing object
 */
const routing = {
  /**
   * Adds component names for tracking
   * @param {string} component Component name
   */
  push(component) {
    if (!list.includes(component)) {
      list.push(component);
    }
  },
  /**
   * Ensures that default route is initialized only once
   */
  init() {
    if (list.length) {
      if (window.location.hash) {
        router.init();
      } else {
        router.set('#/', true);
      }
    }
  }
};

export default routing;
