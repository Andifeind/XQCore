var viewExampleTemplate = new XQCore.Tmpl('./viewExample.tpl');

var view = {
	debug: true,
	id: '#viewExampleView',
	tag: 'section',
	container: '#view1'
};

/**
 * Initialize view
 */
view.init = function() {
	this.render({
		listing: [
			{id: '001', name: 'Test I', text: 'Good morning World!'},
			{id: '002', name: 'Test II', text: 'Hello World!'},
			{id: '003', name: 'Test III', text: 'Good afternoon World!'}
		]
	});
};

/**
 * View template
 */
view.template = viewExampleTemplate;

var viewExampleView = new XQCore.View('ViewExample', view);
