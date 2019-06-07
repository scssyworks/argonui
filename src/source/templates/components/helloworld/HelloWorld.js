class HelloWorld {
  constructor({ el }) {
    this.root = el;
  }
  cache = {};
  initCache() {
    /* Initialize selector cache here */
    /**
     * If component is added more than once please use "this.root" hook to prevent overlap issues.
     * Example:
     * this.cache.$submitBtn = this.root.find('.js-submit-btn');
     */
  }
  bindEvents() {
    /* Bind jQuery events here */
    /**
     * Example:
     * const { $submitBtn } = this.cache;
     * $submitBtn.on('click', () => { ... });
     */
  }
  init() {
    /* Mandatory method */
    this.initCache();
    this.bindEvents();
  }
}

export default HelloWorld;
