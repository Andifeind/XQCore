/*global listingModel:false, addModel:false */
XQCore.debug = true;
var presenter = new XQCore.Presenter('Main', function(self) {
	var mainView = self.initView('main', 'body');
	var listingView = self.initView('listing', '.listing');
	var addView = self.initView('add-form', '.listing', {
		inject: false
	});

	self.couple({
		view: listingView,
		model: listingModel
	});

	self.couple({
		view: addView,
		model: addModel
	});

	self.on('click', function(data) {
		console.log('Click', data);
	});

	self.on('show-add', function(data) {
		addView.inject();
	});

	self.route('index', function(data) {
		listingModel.loadFruits();
	});

	self.route('vegetables', function(data) {
		listingModel.loadVegatables();
	});

	addView.on('form.submit', function() {
		console.log('FormSubmit');
		listingView.inject();
	});

	addView.formSetup(addModel);
});

presenter.init();