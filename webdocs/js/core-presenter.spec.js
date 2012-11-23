describe('Core Presenter', function() {
	beforeEach(function() {

	});

	afterEach(function() {

	});

	it('Should initialize a presenter', function() {
		var presenter,
			initFunc = sinon.spy();

		presenter = new CorePresenter({
			debug: true,
			name: 'test1',
			init: initFunc
		});

		expect(presenter).to.be.an('object');
		expect(initFunc).was.called();
	});

	it('Should define routes', function(done) {
		var presenter,
			testRoute = sinon.spy();

		presenter = new CorePresenter({
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