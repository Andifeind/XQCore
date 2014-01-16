var addModel = new XQCore.Model('Add', function(self) {
	'use strict';

	self.schema = {
		kind: { type: 'string', required: true },
		name: { type: 'string', required: true }
	};

});

addModel.init();