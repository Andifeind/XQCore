/*global XQCore:true, sinon:true, expect:true */
if (typeof global === 'object' && typeof window === 'undefined') {
	//It's node.js

	var XQCore = require('../../../build/xqcore'),
		sinon = require('sinon'),
		expect = require('expect.js');

	expect = require('sinon-expect').enhance(expect, sinon, 'was');
}

describe.only('XQCore.Event', function() {
	'use strict';
	beforeEach(function() {

	});

	afterEach(function() {

	});

	it('Should register an event listener', function() {
		var ee = new XQCore.Event();
		var cbSpy = sinon.spy();
		ee.on('test', cbSpy);
		ee.emit('test', 1, { a: 'AA'});

		expect(cbSpy).was.calledOnce();
		expect(cbSpy).was.calledWith(1, { a: 'AA' });
	});

	it('Should register multiple event listener', function() {
		var ee = new XQCore.Event();
		var ee2 = new XQCore.Event();
		var cbSpy = sinon.spy();
		var cbSpy2 = sinon.spy();
		
		ee.on('test', cbSpy);
		ee2.on('test', cbSpy2);
		
		ee.emit('test', 1, { a: 'AA'});
		ee2.emit('test', 2, { b: 'BB'});

		expect(cbSpy).was.calledOnce();
		expect(cbSpy2).was.calledOnce();
		expect(cbSpy).was.calledWith(1, { a: 'AA' });
		expect(cbSpy2).was.calledWith(2, { b: 'BB' });
	});

	it('Should unregister an event listener', function() {
		var ee = new XQCore.Event();
		var cbSpy = sinon.spy();
		ee.on('test', cbSpy);
		ee.emit('test', 1, { a: 'AA'});
		ee.off('test', cbSpy);
		ee.emit('test', 1, { a: 'AA'});

		expect(cbSpy).was.calledOnce();
		expect(cbSpy).was.calledWith(1, { a: 'AA' });
	});

});