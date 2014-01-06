var listingModel = new XQCore.Model('Listing', function(self) {
	'use strict';

	self.set({
		listing: [
			{name: 'Apple'}
		]
	});
});

listingModel.init();