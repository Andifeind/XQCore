var presenter = new XQCore.Presenter('presenter1', function(self) {
	'use strict';

	var v1 = self.initView('view1', 'body');
	var v2 = self.initView('view2', '#pageLeft');
	var v3 = self.initView('view3', '#pageRight');

	var m1 = self.initModel('model1');

	v1.on('click.item', function(evnt) {
		m1.getItem(evnt.tag.id);
	});

	//Couple view3 with model
	self.couple({
		view: [v2, v3],
		model: m1
	});

});

module.exports = presenter;