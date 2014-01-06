/*global listingModel:false */
XQCore.debug = true;
var presenter = new XQCore.Presenter('Main', function(self) {
	var mainView = self.initView('main', 'body');
	var listingView = self.initView('listing', '.listing');

	self.couple({
		view: listingView,
		model: listingModel
	});
});

presenter.init();