module.exports = function() {
	'use strict';

	var XQCore = require('xqcore'),
		{{model}}Model = require('models/{{model}}.model');

	var presenter = new XQCore.Presenter('{{presenter}}', function(self) {
		var {{view}}View = self.initView('{{view}}', 'body');

		self.couple({
			view: {{view}}View,
			model: {{model}}Model
		});
	});

	return presenter;
}();