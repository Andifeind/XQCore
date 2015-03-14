xdescribe('XQCore Cache', function() {
	'use strict';
	
	beforeEach(function() {

	});

	afterEach(function() {

	});

	it('Should add a item to the cache', function() {
		var cache = new XQCore.Cache();
		cache.set('aa', 'AAA');
		expect(localStorage.getItem('aa')).to.be('AAA');
	});

	it('Should add a item to the cache, using sessionStorage', function() {
		var cache = new XQCore.Cache({
			useSessionStorage: true
		});

		cache.set('bb', 'BBB');
		expect(sessionStorage.getItem('bb')).to.be('BBB');
	});
});