describe('XQCore Presenter', function() {
	'use strict';

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

		expect(renderStub).was.calledWith({
			data: 'changed'
		});

		renderStub.restore();
	});
});