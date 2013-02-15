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
});