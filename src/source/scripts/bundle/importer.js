import { logger } from '../utils/logger';

const initialized = [];

export default function ({ default: ComponentRef, templates, el }) {
  if (typeof ComponentRef === 'function') {
    // Get component instance
    const comp = new ComponentRef({ templates, el });
    const compStr = ComponentRef.toString();
    // Get component name
    const nameMatch = compStr.match(/(class|function)\s[^\s(){}]+/);
    if (typeof comp.init === 'function') {
      comp.init();
      if (nameMatch) {
        logger.log(`[Webpack]: ${nameMatch[0]} has been initialized.`);
      }
    } else if (nameMatch) {
      logger.debug(`[Webpack]: ${nameMatch[0]} does not have an init method.`);
    }
  } else if (
    typeof ComponentRef === 'object'
    && ComponentRef !== null
    && typeof ComponentRef.init === 'function'
  ) {
    if (!ComponentRef.moduleName) {
      // Add a generic name to component in order to identify it in next init cycle
      ComponentRef.moduleName = `_wp_module_${Date.now()}${initialized.length}`;
    }
    if (!initialized.includes(ComponentRef.moduleName)) {
      ComponentRef.init({ templates, el });
      initialized.push(ComponentRef.moduleName);
      logger.log(`[Webpack] ${ComponentRef.moduleName} has been initialized.`);
    } else {
      logger.debug(`[Webpack] ${ComponentRef.moduleName} has already been initialized. Please switch to class modules if you want to re-initialize components.`);
    }
  }
}
