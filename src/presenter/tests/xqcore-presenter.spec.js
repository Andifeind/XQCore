describe.only('XQCore Presenter', function() {
	'use strict';

	describe('initialize', function() {
		it('Should initialize a presenter', function() {
			var presenter,
				initFunc = sinon.spy();

			presenter = new XQCore.Presenter('Test I', {
				init: initFunc
			});

			expect(presenter).to.be.a(XQCore.Presenter);
			presenter.init();
			expect(initFunc).was.called();
		});

		it('Should initialize a presenter in the scope way', function() {
			var presenter,
				initFunc = sinon.spy();

			presenter = new XQCore.Presenter('Test II', initFunc);

			expect(presenter).to.be.a(XQCore.Presenter);
			presenter.init();
			expect(initFunc).was.called();
		});

		it('Should get a presenter name from first arg', function() {
			var presenter = new XQCore.Presenter('Test');
			expect(presenter.name).to.equal('TestPresenter');
		});

		it('Should get a presener name from conf object', function() {
			var presenter = new XQCore.Presenter({
				name: 'Test'
			});

			expect(presenter.name).to.equal('TestPresenter');
		});

		it('Should set a default presenter name', function() {
			var presenter = new XQCore.Presenter();
			expect(presenter.name).to.equal('NamelessPresenter');
		});
	});

	describe('couple', function() {
		var renderStub,
			appendStub,
			prependStub,
			insertStub,
			removeStub,
			presenter,
			model,
			view;

		beforeEach(function() {
			presenter = new XQCore.Presenter();
			model = new XQCore.Model();
			view = new XQCore.View();
			
			renderStub = sinon.stub(view, 'render');
			appendStub = sinon.stub(view, 'append');
			prependStub = sinon.stub(view, 'prepend');
			insertStub = sinon.stub(view, 'insert');
			removeStub = sinon.stub(view, 'remove');
				
			presenter.init();
		});

		afterEach(function() {
			renderStub.restore();
			appendStub.restore();
			prependStub.restore();
			insertStub.restore();
			removeStub.restore();
		});
		
		it('Should couple a model with a view', function() {
			presenter.couple({
				view: view,
				model: model
			});

			model.set({
				data: 'changed'
			});

			expect(renderStub).was.called();
			expect(renderStub).was.calledWith({
				data: 'changed'
			});
		});
		
		it('Should render view with model data on an initial call', function() {
			model.properties = {
				'data': 'initial'
			};

			presenter.couple({
				view: view,
				model: model
			});

			expect(renderStub).was.calledOnce();
			expect(renderStub).was.calledWith({
				data: 'initial'
			});
		});

		it('Should couple a model with a view in scope way', function() {
			presenter = new XQCore.Presenter('Test', function(self) {
				self.couple({
					view: view,
					model: model
				});
			}).init();

			model.set({
				data: 'changed'
			});

			expect(renderStub).was.calledTwice();
			expect(renderStub).was.calledWith({
				data: 'changed'
			});
		});

		it('Should trigger an append event', function() {
			presenter.couple({
				view: view,
				model: model
			});

			model.append('listing', {
				data: 'changed'
			});

			expect(renderStub).was.calledOnce();
			expect(appendStub).was.calledOnce();
			expect(appendStub).was.calledWith('listing', {
				data: 'changed'
			});
		});

		it('Should trigger an prepend event', function() {
			presenter.couple({
				view: view,
				model: model
			});

			model.prepend('listing', {
				data: 'changed'
			});

			expect(renderStub).was.calledOnce();
			expect(prependStub).was.calledOnce();
			expect(prependStub).was.calledWith('listing', {
				data: 'changed'
			});
		});

		it('Should trigger an insert event', function() {
			presenter.couple({
				view: view,
				model: model
			});

			model.insert('listing', 0, {
				data: 'changed'
			});

			expect(renderStub).was.calledOnce();
			expect(insertStub).was.calledOnce();
			expect(insertStub).was.calledWith('listing', 0, {
				data: 'changed'
			});
		});

		it('Should trigger an remove event', function() {
			presenter.couple({
				view: view,
				model: model
			});

			model.set({ listing: [ { name: 'AAA' }]}, { silent: true });
			model.remove('listing', 0);

			expect(renderStub).was.calledOnce();
			expect(removeStub).was.calledOnce();
			expect(removeStub).was.calledWith('listing', 0, {
				name: 'AAA'
			});
		});
	});

	describe('initView', function() {
		var getTemplateStub;

		beforeEach(function() {
			getTemplateStub = sinon.stub(XQCore.Tmpl, 'getTemplate');
			getTemplateStub.returns('<div></div>');
		});

		afterEach(function() {
			getTemplateStub.restore();
		});

		it('Should initialize a view', function() {
			var presenter = new XQCore.Presenter('Test', function(self) {
				var view = self.initView('TestI');
				expect(view).to.be.a(XQCore.View);
				expect(presenter.__views.TestI).to.be.ok();
			});

			presenter.init();
		});

		it('Should init view', function() {
			var initStub = sinon.stub(XQCore.View.prototype, 'init');
			
			var presenter = new XQCore.Presenter('Test', function(self) {
				self.initView('TestView');
			});

			presenter.init();

			expect(initStub).was.calledOnce();
			initStub.restore();
		});

		it('Should log a warning on registering an existing view', function() {
			var presenter = new XQCore.Presenter('Test', function(self) {
				var warnStub = sinon.stub(presenter, 'warn');

				self.initView('TestI');
				self.initView('TestI');
				
				expect(warnStub).was.called();
				expect(warnStub).was.calledWith('View allready registered!');
				warnStub.restore();
			});

			presenter.init();
		});
	});

	describe('route', function() {
		it('Should register a routing listener', function() {
			var indexStub = sinon.stub();
			var addStub = sinon.stub();
			
			var presenter = new XQCore.Presenter('Test', function(self) {
				self.route('index', indexStub);
				self.route('add', addStub);

				expect(self.__Router.routeMap).to.eql({
					'index': indexStub,
					'add': addStub
				});
			});

			presenter.init();
		});

		it('Should register an array of routes with the same listener', function() {
			var indexStub = sinon.stub();
			var addStub = sinon.stub();
			
			var presenter = new XQCore.Presenter('Test', function(self) {
				self.route('index', indexStub);
				self.route(['add', 'new'], addStub);

				expect(self.__Router.routeMap).to.eql({
					'index': indexStub,
					'add': addStub,
					'new': addStub
				});
			});

			presenter.init();
		});
	});
});