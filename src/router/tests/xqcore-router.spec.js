describe('XQCore Router', function() {
	'use strict';

	var router, func;

	beforeEach(function() {
		func = sinon.spy();
		router = new XQCore.Router();
		// console.log('Router', router);
		router.addRoute('/test/xx/*', func);
		router.addRoute('/test/gg/:id?', func);
		router.addRoute('/test/aaa/:id', func);
		router.addRoute('/test/:id/bla/:num', func);
		router.addRoute('/test/:id', func);
		router.addRoute('/test', func);
	});

	afterEach(function() {

	});

	it('Should add and match some basic routes', function() {
		var route;

		route = router.match('/test');
		expect(route).to.be.an(Object);
		expect(route.fn).to.equal(func);

		route = router.match('/test/23');
		expect(route).to.be.an(Object);
		expect(route.fn).to.equal(func);
		expect(route.params.id).to.equal('23');

		route = router.match('/test/aaa/33');
		expect(route).to.be.an(Object);
		expect(route.fn).to.equal(func);
		expect(route.params.id).to.equal('33');

		route = router.match('/test/55/bla/5677');
		expect(route).to.be.an(Object);
		expect(route.fn).to.equal(func);
		expect(route.params.id).to.equal('55');
		expect(route.params.num).to.equal('5677');
	});

	it('Should add and match routes with optional parameter', function() {
		var route;

		route = router.match('/test/gg/44/bla/blub');
		expect(route).to.be(undefined);

		route = router.match('/test/gg/44');
		expect(route).to.be.an(Object);
		expect(route.fn).to.equal(func);
		expect(route.params.id).to.equal('44');

		route = router.match('/test/gg/');
		expect(route).to.be.an(Object);
		expect(route.fn).to.equal(func);
		expect(route.params.id).to.be(undefined);
	});

	it('Should add and match some splat routes', function() {
		var route;

		route = router.match('/test/xx');
		expect(route).to.be.an(Object);
		expect(route.fn).to.equal(func);
		expect(route.splats[0]).to.be(undefined);

		route = router.match('/test/xx/');
		expect(route).to.be.an(Object);
		expect(route.fn).to.equal(func);
		expect(route.splats[0]).to.be(undefined);

		route = router.match('/test/xx/aa');
		expect(route).to.be.an(Object);
		expect(route.fn).to.equal(func);
		expect(route.splats[0]).to.equal('aa');
	});
});