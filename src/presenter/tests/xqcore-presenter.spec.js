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
		it('Should couple a model with a view', function() {
			var presenter = new XQCore.Presenter();
			var model = new XQCore.Model();
			var view = new XQCore.View();

			presenter.couple({
				view: view,
				model: model
			});

			var renderStub = sinon.stub(view, 'render');
			model.set({
				data: 'changed'
			});

			expect(renderStub).was.called();
			expect(renderStub).was.calledWith({
				data: 'changed'
			});

			renderStub.restore();
		});

		it('Should couple a model with a view in scope way', function() {
			var model = new XQCore.Model();
			var view = new XQCore.View();
			var presenter = new XQCore.Presenter('Test', function(self) {
				self.couple({
					view: view,
					model: model
				});
			});

			presenter.init();

			var renderStub = sinon.stub(view, 'render');
			model.set({
				data: 'changed'
			});


			expect(renderStub).was.called();
			expect(renderStub).was.calledWith({
				data: 'changed'
			});

			renderStub.restore();
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
			var renderStub = sinon.stub(XQCore.View.prototype, 'render');
			
			var presenter = new XQCore.Presenter('Test', function(self) {
				self.initView('TestView');
			});

			presenter.init();

			expect(renderStub).was.called();
			expect(renderStub).was.calledWith();

			renderStub.restore();
		});

		it('Should init but dont\'t render a view', function() {
			var renderStub = sinon.stub(XQCore.View.prototype, 'render');
			
			var presenter = new XQCore.Presenter('Test', function(self) {
				self.initView('TestView', 'none', {
					render: false
				});
			});

			presenter.init();

			expect(renderStub).was.notCalled();

			renderStub.restore();
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