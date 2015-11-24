var listingModel = new XQCore.Model('Listing', function(self) {
	'use strict';

	self.set({
		listing: [
			{name: 'Apple'}
		]
	});

	self.loadFruits = function() {
		self.set({
			listing: [
				{name: 'Apple'},
				{name: 'Banana'},
				{name: 'Coconut'}
			]
		});
	};

	self.loadVegatables = function() {
		self.set({
			listing: [
				{name: 'Potatoe'},
				{name: 'Letuce'},
				{name: 'Corn'}
			]
		});
	};
});

listingModel.init();