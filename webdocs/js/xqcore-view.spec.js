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
		var testPresenter,
			testView;

		testPresenter = new XQCore.Presenter({
			'viewInit': function(view) {
				if (view.name === 'testView') {
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

		testView = new XQCore.View(testPresenter, {
			name: 'test',
			container: viewContainer,
			template: '<ul>\
				{{#each listing}}\
				<li>{{text}}</li>\
				{{/each}}\
				</ul>'
		});

		expect(testView).to.be.an('object');
		$expect(viewContainer).to.have('ul > li');
	});

	it('Should forget to set the subSelector and should log an error to the console', function() {
		var presenter = new XQCore.Presenter({
		});

		var view = new XQCore.View(presenter, {
			debug: true,
			container: viewContainer
		});

		var	log = sinon.spy(view, 'warn');

		view.append({
			test: 'aaa'
		});


		expect(log).was.called();
		expect(log).was.calledWith('You must set the subSelector option');
	});

	it('Should forget to set the itemTemplate and should log an error to the console', function() {
		var presenter = new XQCore.Presenter({
		});

		var view = new XQCore.View(presenter, {
			debug: true,
			container: viewContainer,
			subSelector: '#test'
		});

		var	log = sinon.spy(view, 'warn');

		view.append({
			test: 'aaa'
		});


		expect(log).was.called();
		expect(log).was.calledWith('You must set the itemTemplate option');
	});

	it('Should add a html fragment to an existing html node', function() {
		var presenter = new XQCore.Presenter({
		});

		var view = new XQCore.View(presenter, {
			debug: true,
			container: viewContainer,
			subSelector: '#test',
			itemTemplate: '<span>{{name}}</span>'
		});

		var	log = sinon.spy(view, 'warn');
		
		view.append({
			name: 'aaa'
		});
		
		view.append({
			name: 'bbb'
		});
		
		view.append({
			name: 'ccc'
		});
		
		view.append({
			name: 'ddd'
		});
		
		view.append({
			name: 'eee'
		});


		expect(log).was.notCalled();
		$expect('#test > span').to.exist();
		$expect('#test > span:eq(0)').to.contain('aaa');
		$expect('#test > span:eq(1)').to.contain('bbb');
		$expect('#test > span:eq(2)').to.contain('ccc');
		$expect('#test > span:eq(3)').to.contain('ddd');
		$expect('#test > span:eq(4)').to.contain('eee');
	});

	it('Should prepend a html fragment to an existing html node', function() {
		var presenter = new XQCore.Presenter({
		});

		var view = new XQCore.View(presenter, {
			debug: true,
			container: viewContainer,
			subSelector: '#test',
			itemTemplate: '<span>{{name}}</span>'
		});

		var	log = sinon.spy(view, 'warn');
		
		view.prepend({
			name: 'aaa'
		});
		
		view.prepend({
			name: 'bbb'
		});
		
		view.prepend({
			name: 'ccc'
		});
		
		view.prepend({
			name: 'ddd'
		});
		
		view.prepend({
			name: 'eee'
		});


		expect(log).was.notCalled();
		$expect('#test > span').to.exist();
		$expect('#test > span:eq(0)').to.contain('eee');
		$expect('#test > span:eq(1)').to.contain('ddd');
		$expect('#test > span:eq(2)').to.contain('ccc');
		$expect('#test > span:eq(3)').to.contain('bbb');
		$expect('#test > span:eq(4)').to.contain('aaa');
	});

});