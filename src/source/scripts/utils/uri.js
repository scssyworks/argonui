import $ from 'jquery';
import { logger } from './logger';

export const apiHost = $('#apiHost').val();
export let uriCache = {};
/**
 * Returns URL for given URL name
 * @param {string} urlName API URL name
 */
export function getURL(urlName) {
  try {
    uriCache.apiMappings = uriCache.apiMappings || JSON.parse($('#apiMappings').val());
  } catch (e) {
    uriCache.apiMappings = {};
    logger.error(e);
  }
  return uriCache.apiMappings[urlName] || '';
}
