/**
 * Template module
 *
 * @package XQCore
 * @module Tmpl
 */

'use strict';

var XQCore = require('./xqcore');
var FireTPL = require('firetpl');

var Tmpl = {
  type: 'firetpl',
  compile: FireTPL.compile,
  getTemplate: function(viewName, options) {
    options = options || {};
    if (FireTPL.templateCache && FireTPL.templateCache[viewName]) {
      return FireTPL.templateCache[viewName];
    }
    else if(!FireTPL.loadFile) {
      throw new Error('FireTPL runtime is being used. Please preload the ' + viewName + 'View');
    }
    else {
      var viewDir = options.viewDir || XQCore.viewsDir;
      var tmpl = FireTPL.readFile(viewDir.replace(/\/$/, '') + '/' + viewName + '.' + XQCore.viewExt.replace(/^\./, ''));
      return FireTPL.compile(tmpl, {
        eventAttrs: true
      });
    }
  }
};

//--

module.exports = Tmpl;
