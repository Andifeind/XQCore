describe('Instance tests', function() {
	beforeEach(function() {

	});

	afterEach(function() {

	});

	it('Each model instance should have his own EventEmitter', function(done) {
		var modelA = new XQCore.Model(),
			modelB = new XQCore.Model();

		modelA.on('aaa', function() {
			done('Fail');
		});

		modelB.on('aaa', function() {
			setTimeout(function() {
				done();
			}, 200);
		});

		modelB.emit('aaa');
		//expect(modelA.on).not.to.equal(modelB.on);
	});
});