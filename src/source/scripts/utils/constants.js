// Constants
export const IS_MOBILE_REGEX = /android|webos|iphone|blackberry|iemobile|opera mini/i;
export const IS_TABLET_REGEX = /ipad|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i;
export const INVALID_OBJECT = 'Function \'fn\' expects a valid configuration object';
export const PARSE_ERROR = 'Block data could not be parsed';
export const TEMPLATE_MISSING = 'Target template is missing';
export const INVALID_URL = 'URL is invalid';
export const INIT_FAILED = 'One or more components were not initialized';
export const RESULTS_EMPTY = 'Empty results';
export const FILEEXT_EMPTY = 'File extension is required';
export const INVALID_CONFIG = 'Invalid configuration';
export const INVALID_STREAM = 'Stream is invalid';
export const INVALID_BROWSER = 'Unsupported browser';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_RANGE_SEPARATOR = ' - ';
export const ORDER_HISTORY_ROWS_PER_PAGE = 10;
export const ORDER_DETAILS_ROWS_PER_PAGE = 10;
export const FINANCIAL_DATE_RANGE_PERIOD = 45;
export const NO_OF_EVENTS_PER_PAGE = 12;
export const NO_OF_EVENTS_ON_CARD = 6;
export const EXT_PDF = 'pdf';
export const EXT_EXCEL = 'xlsx';
export const TRANSITION_END = 'webkitTransitionEnd mozTransitionEnd oTransitionEnd transitionend';
export const MOCK_URL = '/apps/settings/wcm/designs/customerhub/jsonData';
export const ajaxMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};
export const mediaTypes = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
};
export const orientationTypes = {
  LANDSCAPE: 'landscape',
  PORTRAIT: 'portrait',
  UNSUPPORTED: 'unsupported'
};
// API URLs
export const API_TOKEN = 'token-generator';
export const API_SEARCH = 'ordersearch';
export const API_ORDER_HISTORY = 'orderingcard';
export const API_FINANCIAL_SUMMARY = 'financialstatement-filter';
export const API_FINANCIALS_STATEMENTS = 'financialstatement-results';
export const API_FINANCIALS_INVOICE = 'financialstatement-invoice';
export const API_ORDER_DETAIL_PARTS = 'orderdetails-parts';
export const API_ORDER_DETAIL_PACKMAT = 'orderdetails-packmat';
export const API_MAINTENANCE_FILTERS = 'maintenance-filter';
export const API_MAINTENANCE_EVENTS = 'maintenance-events';
export const API_DOCUMENTS_SEARCH = 'documents';
export const API_DOCUMENTS_FILTERS = 'documents-filter';
