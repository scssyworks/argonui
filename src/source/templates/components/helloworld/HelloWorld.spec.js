import HelloWorld from './HelloWorld';

describe('HelloWorld', function () {
  before(function () {
    this.helloWorld = new HelloWorld({
      el: document.body
    });
  });
});
