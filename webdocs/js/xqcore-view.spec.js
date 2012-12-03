describe('XQCore View', function() {
	var viewContainer;

	beforeEach(function() {
		viewContainer = $('<div><div id="test"></div></div>').appendTo('body');
	});

	afterEach(function() {
		viewContainer.remove();
	});

	it('Should initialize a view', function() {
		var presenter,
			view,
			initFunc = sinon.spy();

		presenter = new XQCore.Presenter({
			
		});

		view = new XQCore.View(presenter, {
			debug: true,
			name: 'test1',
			init: initFunc,
			container: viewContainer
		});

		expect(view).to.be.an('object');
		expect(initFunc).was.called();
	});

	it('Should register view events at presenter', function() {
		var view,
			presenter,
			testSpy1 = sinon.spy(),
			testSpy2 = sinon.spy();

		presenter = new XQCore.Presenter({
			'events': {
				'test1': testSpy1,
				'test2': testSpy2
			}
		});

		view = new XQCore.View(presenter, {
			debug: true,
			name: 'test1',
			container: viewContainer,
			events: {
				'mousedown #test': 'test1',
				'mouseup #test': 'test2'
			}
		});

		expect(view).to.be.an('object');
		expect(presenter).to.be.an('object');
		
		viewContainer.trigger('mousedown');
		viewContainer.trigger('mouseup');
		expect(testSpy1).was.called();
		expect(testSpy2).was.called();
	});

	it('Should initialize a view and call presenter.viewInit', function() {
		var presenter,
			view,
			initFunc = sinon.spy();

		presenter = new XQCore.Presenter({
			'viewInit': initFunc
		});

		view = new XQCore.View(presenter, {
			container: viewContainer
		});

		expect(view).to.be.an('object');
		expect(initFunc).was.called();
	});

	it('Should render a view triggered by presenter.viewInit()', function() {
		var presenter,
			view;

		presenter = new XQCore.Presenter({
			'viewInit': function(view) {
				var data;
				if (view.name === 'test') {
					view.render({
						listing:[
							{text: 'aaa'},
							{text: 'bbb'},
							{text: 'ccc'},
							{text: 'ddd'},
							{text: 'eee'}
						]
					});
				}
			}
		});

		view = new XQCore.View(presenter, {
			name: 'test',
			container: viewContainer,
			template: '<ul>\
				{{#each listing}}\
				<li>{{text}}</li>\
				{{/each}}\
				</ul>'
		});

		expect(view).to.be.an('object');
		$expect(viewContainer).to.have('ul > li');
	});

});