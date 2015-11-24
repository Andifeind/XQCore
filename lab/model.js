var model = new XQCore.Model('model1', function(self) {
	'use strict';

	self.init = function() {
		self.getCategories();
	};

	self.getItem = function(id) {
		self.fetch({
			itemId: id
		}, function(err, data) {
			self.set('item', data);
		});
	};

	self.getCategories = function() {
		self.fetch({
			
		}, function(err, listing) {
			self.set('categories', listing);
		});
	};
});

module.exports = model;