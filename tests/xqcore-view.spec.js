'use strict';

describe.only('View', function() {
  describe('Instance', function() {
    it('Should create a view instance', function() {
      var view = new XQCore.View('Core');
      expect(view).to.be.an('object');
    });
  });
});
