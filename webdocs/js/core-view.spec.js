describe('Core View', function() {
	var viewContainer;

	beforeEach(function() {
		viewContainer = $('<div><div id="test"></div></div>').appendTo('body');
	});

	afterEach(function() {
		viewContainer.remove();
	});

	it('Should initialize a view', function() {
		var view,
			initFunc = sinon.spy();

		view = new CoreView({}, {
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

		presenter = new CorePresenter({
			'events': {
				'test1': testSpy1,
				'test2': testSpy2
			}
		});

		view = new CoreView(presenter, {
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

});