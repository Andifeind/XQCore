'use strict';

let inspect = require('inspect.js');
let sinon = require('sinon');
inspect.useSinon(sinon);

let XQCore = require('../xqcore-init');

describe('XQCore.Component', function() {
  describe('Instance', function() {
    it('Create a component', function() {
      inspect(XQCore.Component).isClass();
    });

    ['Core', 'Form'].forEach(function(cmp) {
      it('Has a ' + cmp + ' component', function() {
        inspect(XQCore.getComponent(cmp)).isClass();
      });
    });
  });


});
