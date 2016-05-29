'use strict';

var inspect = require('inspect.js');
var XQCore = require('../xqcore-init');

describe.only('View', function() {
  describe('Instance', function() {
    it('Should create a view instance', function() {
      var view = new XQCore.View('Core');
      inspect(view).isObject();
    });

    it('Should create a view with a Core element', function() {
      var view = new XQCore.View('Core');
      inspect(view.el).isObject();
      inspect.print(view);
      inspect(view.tag).isEql('section');
    });
  });
});
