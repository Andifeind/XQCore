describe('XQCore Presenter', function() {
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

			presenter.couple({
				view: view,
				model: model
			});
			
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
			model.set({
				data: 'changed'
			});

			expect(renderStub).was.called();
			expect(renderStub).was.calledWith({
				data: 'changed'
			});
		});

		it('Should couple a model with a view in scope way', function() {
			presenter = new XQCore.Presenter('Test', function(self) {
				self.couple({
					view: view,
					model: model
				});
			});

			model.set({
				data: 'changed'
			});

			expect(renderStub).was.called();
			expect(renderStub).was.calledWith({
				data: 'changed'
			});
		});

		it('Should trigger an append event', function() {
			model.append('listing', {
				data: 'changed'
			});

			expect(renderStub).was.notCalled();
			expect(appendStub).was.calledOnce();
			expect(appendStub).was.calledWith('listing', {
				data: 'changed'
			});
		});

		it('Should trigger an prepend event', function() {
			model.prepend('listing', {
				data: 'changed'
			});

			expect(renderStub).was.notCalled();
			expect(prependStub).was.calledOnce();
			expect(prependStub).was.calledWith('listing', {
				data: 'changed'
			});
		});

		it('Should trigger an insert event', function() {
			model.insert('listing', 0, {
				data: 'changed'
			});

			expect(renderStub).was.notCalled();
			expect(insertStub).was.calledOnce();
			expect(insertStub).was.calledWith('listing', 0, {
				data: 'changed'
			});
		});

		it('Should trigger an remove event', function() {
			model.set({ listing: [ { name: 'AAA' }]}, { silent: true });
			model.remove('listing', 0);

			expect(renderStub).was.notCalled();
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

		it('Should init and render a view', function() {
			var renderStub = sinon.stub(XQCore.View.prototype, 'render'),
				injectStub = sinon.stub(XQCore.View.prototype, 'inject');
			
			var presenter = new XQCore.Presenter('Test', function(self) {
				self.initView('TestView');
			});

			presenter.init();

			expect(renderStub).was.called();
			expect(renderStub).was.called();
			expect(injectStub).was.calledWith();
			expect(renderStub).was.calledWith();

			renderStub.restore();
			injectStub.restore();
		});

		it('Should init but dont\'t inject view', function() {
			var renderStub = sinon.stub(XQCore.View.prototype, 'render'),
				injectStub = sinon.stub(XQCore.View.prototype, 'inject');
			
			var presenter = new XQCore.Presenter('Test', function(self) {
				self.initView('TestView', 'none', {
					inject: false
				});
			});

			presenter.init();

			expect(renderStub).was.called();
			expect(injectStub).was.notCalled();

			renderStub.restore();
			injectStub.restore();
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

		xit('Should register Test view', function() {
			var presenter = new XQCore.Presenter('Test', function(self) {
				var view = self.initView('Test');
				expect(view).to.be.a(XQCore.View);
				expect(presenter.__views.TestI).to.be.ok();
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
	});
});