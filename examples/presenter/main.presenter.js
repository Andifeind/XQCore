/*global listingModel:false */
XQCore.debug = true;
var presenter = new XQCore.Presenter('Main', function(self) {
	var mainView = self.initView('main', 'body');
	var listingView = self.initView('listing', '.listing');
	var addView = self.initView('add-form', '.listing');

	self.couple({
		view: listingView,
		model: listingModel
	});

	self.couple({
		view: addView,
		model: listingModel
	});

	self.on('click', function(data) {
		console.log('Click', data);
	});

	self.on('show-add', function(data) {
		
	});

	self.route('index', function(data) {
		listingModel.loadFruits();
	});

	self.route('vegetables', function(data) {
		listingModel.loadVegatables();
	});
});

presenter.init();