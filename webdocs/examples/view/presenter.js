var presenter = {
	debug: true,
	name: 'Name'
};

/**
 * Events
 */
presenter.events = {

};

/**
 * Routes
 */
presenter.routes = {
	'default': 'showViewNameView'
};

/**
 * Show ViewName view
 */
presenter.showViewNameView = function() {
	this.showView('ViewExample');
};

var presenter = new XQCore.Presenter(presenter);

presenter.registerView([
	viewExampleView
]);

$(function() {
	presenter.init();
});

/*presenter.registerModel([
	nameModel
]);*/

