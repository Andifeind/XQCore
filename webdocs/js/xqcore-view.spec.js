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

		view = new XQCore.View({
			debug: true,
			name: 'test1',
			init: initFunc,
			container: viewContainer
		});

		presenter.registerView(view);
		presenter.init();

		expect(view).to.be.an('object');
		expect(initFunc).was.called();
	});

	it('Should register view events at presenter', function() {
		var view,
			presenter,
			testSpy1 = sinon.spy(),
			testSpy2 = sinon.spy();

		presenter = new XQCore.Presenter({
			events: {
				'test1': testSpy1,
				'test2': testSpy2
			}
		});

		view = new XQCore.View({
			debug: true,
			name: 'test1',
			container: viewContainer,
			events: {
				'mousedown #test': 'test1',
				'mouseup #test': 'test2'
			}
		});

		presenter.registerView(view);
		presenter.init();

		expect(view).to.be.an('object');
		expect(presenter).to.be.an('object');

		viewContainer.find('#test').trigger('mousedown');
		viewContainer.find('#test').trigger('mouseup');
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

		presenter.init(view);

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

		testPresenter.init(testView);

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

	it('Should gets the data of an element', function() {
		$('#test').html('<ul>\
			<li data-id="123" data-bla="blub">Example</li>\
			<li data-id="124" data-bla="blub blub">Example II</li>\
			<li data-id="125" data-bla="blubber blub">Example III</li>\
		</ul>');

		var presenter = new XQCore.Presenter({
		});

		var view = new XQCore.View(presenter, {
			container: viewContainer
		});

		expect(view.getElementData('#test li:eq(0)')).to.eql({
			id: '123',
			bla: 'blub'
		});

		expect(view.getElementData(document.getElementById('test').getElementsByTagName('li')[1])).to.eql({
			id: '124',
			bla: 'blub blub'
		});

		expect(view.getElementData('#dont-exists')).to.be(null);
		expect(view.getElementData(undefined)).to.be(null);
		expect(view.getElementData(null)).to.be(null);


	});

	it('Should gets the data of an element and should convert its datatypes correctly', function() {
		$('#test').html('<ul>' +
			'<li data-id="121" data-bla="true">Example</li>' +
			'<li data-id="122" data-bla="false">Example II</li>' +
			'<li data-id="123" data-bla="null">Example III</li>' +
			'<li data-id="124" data-bla="undefined">Example IV</li>' +
			'<li data-id="125" data-bla="123">Example V</li>' +
			'<li data-id="126" data-bla="-123">Example VI</li>' +
			'<li data-id="127" data-bla="{&quot;a&quot;:&quot;b&quot;}">Example III</li>' +
		'</ul>');

		var presenter = new XQCore.Presenter({
		});

		var view = new XQCore.View(presenter, {
			container: viewContainer
		});

		expect(view.getElementData('#test li:eq(0)')).to.eql({
			id: '121',
			bla: true
		});

		expect(view.getElementData('#test li:eq(1)')).to.eql({
			id: '122',
			bla: false
		});

		expect(view.getElementData('#test li:eq(2)')).to.eql({
			id: '123',
			bla: null
		});

		expect(view.getElementData('#test li:eq(3)')).to.eql({
			id: '124',
			bla: undefined
		});

		expect(view.getElementData('#test li:eq(4)')).to.eql({
			id: '125',
			bla: 123
		});

		expect(view.getElementData('#test li:eq(5)')).to.eql({
			id: '126',
			bla: -123
		});

		expect(view.getElementData('#test li:eq(6)')).to.eql({
			id: '127',
			bla: {
				a: 'b'
			}
		});

	});

});