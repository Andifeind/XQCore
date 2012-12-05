describe('XQCore Router', function() {
	var router;

	beforeEach(function() {
		router = new XQCore.Router();
	});

	afterEach(function() {

	});

	it('Should add some routes', function() {
		var func = sinon.spy(),
			route;

		router.addRoute('/test', func);
		router.addRoute('/test/:id', func);
		router.addRoute('/test/aaa/:id', func);
		router.addRoute('/test/:id?', func);
		router.addRoute('/test/:id/bla/:num', func);
		
		route = router.match('/test');
		expect(route).to.be.an(Object);
		expect(route.fn).to.equal(func);


		router.addRoute('/test', func);
		route = router.match('/test');
		expect(route).to.be.an(Object);
		expect(route.fn).to.equal(func);
	});
});