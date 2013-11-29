describe('XQCore Presenter', function() {

	beforeEach(function() {

	});

	afterEach(function() {

	});

	it('Should initialize a presenter', function() {
		var presenter,
			initFunc = sinon.spy();

		presenter = new XQCore.Presenter({
			debug: true,
			name: 'test1',
			init: initFunc
		});

		expect(presenter).to.be.an('object');
		presenter.init();
		expect(initFunc).was.called();
	});

	xit('Should define routes', function(done) {
		var presenter,
			testRoute = sinon.spy();

		presenter = new XQCore.Presenter({
			debug: true,
			name: 'test2',
			routes: {
				'test': 'test'
			},
			test: function() {
				location.hash = '';
				expect(this).to.be(presenter);
				done();
			}
		});

		location.hash = 'test';
	});

	it('Should combine a model with a view', function(done) {
		var presenter = new XQCore.Presenter();
		var model = new XQCore.Model();
		var view = new XQCore.View();

		presenter.combine({
			view: view,
			model: model
		});

		var renderStub = sinon.stub(view, 'render');
		model.set({
			data: 'changed'
		});

		expect(renderStub).was.calledWith({
			data: 'changed'
		});

		renderStub.restore();
	});
});