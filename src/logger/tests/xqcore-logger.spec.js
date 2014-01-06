describe('XQCore Logger', function() {
	'use strict';
	var log;
	beforeEach(function() {
		log = new XQCore.Logger();
		log.debug = true;
		log.name = 'test';
	});

	afterEach(function() {

	});

	it('Should start a timer', function() {
		var timer = log.timer('test1');
		expect(timer).to.be.an('object');
		expect(timer).to.have.property('name');
		expect(timer).to.have.property('start');
		expect(timer).to.have.property('stop');
		expect(timer).to.have.property('end');
		expect(timer.end).to.be.a('function');
	});

	it('Should stop a timer and logs the resultto the console', function() {
		var timer,
			lastArgs;

		console._log = console.log;
		console.log = function() {
			lastArgs = Array.prototype.slice.call(arguments);
		};

		timer = log.timer('test2');
		console.log(timer);
		timer.end();
		expect(lastArgs[1]).to.contain('Timer test2 runs:');
		// expect(consoleLogSpy.lastCall).was.calledWith(consoleLogSpy, 'Stop test2 Timer');

		console.log = console._log;
	});

	it('Should convert a number into a readable time string', function() {
		expect(log.__scope.getHumanTime(399)).to.eql('399 ms');
		expect(log.__scope.getHumanTime(5555)).to.eql('5.6 sec');
		expect(log.__scope.getHumanTime(66666)).to.eql('1 min 7 sec');
	});
});