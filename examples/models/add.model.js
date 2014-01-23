var addModel = new XQCore.Model('Add', function(self) {
	'use strict';

	self.schema = {
		kind: { type: 'string', required: true },
		name: { type: 'string', required: true }
	};

	self.on('data.change', function(data) {
	});

	self.setData = function(data) {
		console.log('SetData', data);
		listingModel.append('listing', [data]);
	};

});

addModel.init();