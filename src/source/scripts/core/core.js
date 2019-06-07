// Vendor imports
import 'core-js/features/promise';
import 'core-js/features/array/includes';
import $ from 'jquery';
// Local imports
import bundleImport, { allImports } from '../bundle/imports';
import bundleImporter from '../bundle/importer';
import { templates } from '../utils/templates';
import domReady from '../utils/domReady';
import './corescss';
import routing from '../utils/routing';
import { logger } from '../utils/logger';
import { INIT_FAILED } from '../utils/constants';

$(function () {
  const $componentReference = $('[data-module]');
  const components = [];
  // Discover components
  $componentReference.each(function () {
    const componentList = $(this).data('module').split(',').map(componentName => componentName.trim());
    componentList.forEach((componentName) => {
      if (!components.includes(componentName)) {
        components.push({ componentName, el: this });
      }
    });
  });
  // Fetch component bundles
  components.forEach(({ componentName, el }) => {
    // Import bundle
    bundleImport(componentName, function (args) {
      args.templates = templates;
      args.el = el;
      bundleImporter(args);
    });
  });
  domReady.init();
  Promise.all(allImports)
    .then(routing.init)
    .catch(() => {
      logger.log(INIT_FAILED);
    });
});
