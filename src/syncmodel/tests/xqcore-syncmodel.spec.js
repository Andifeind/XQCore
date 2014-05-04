/*global XQCore:true, sinon:true, expect:true */
if (typeof global === 'object' && typeof window === 'undefined') {
	//It's node.js

	var XQCore = require('../../../build/xqcore'),
		sinon = require('sinon'),
		expect = require('expect.js');

	expect = require('sinon-expect').enhance(expect, sinon, 'was');
}

describe('XQCore.SyncModel', function() {
	'use strict';

	describe('initialize', function() {
		it('Should be an instance of SyncModel', function() {
			expect(XQCore.SyncModel).to.be.a('function');
		});

		it('Should be an instance of Model', function() {
			expect(XQCore.Model).to.be.a('function');
		});

		it('Should create an instance', function() {
			var syncModel = new XQCore.SyncModel('test');
			
			expect(syncModel).to.be.an('object');
			expect(syncModel).to.be.a(XQCore.SyncModel);
		});

		it('Should have been extended by XQCore.Model', function() {
			var syncModel = new XQCore.SyncModel('test');

			expect(syncModel.set).to.be.a('function');
			expect(syncModel.get).to.be.a('function');
			expect(syncModel.has).to.be.a('function');
			expect(syncModel.append).to.be.a('function');
		});

		it('Should have been extended by XQCore.Event', function() {
			var syncModel = new XQCore.SyncModel('test');

			expect(syncModel.on).to.be.a('function');
			expect(syncModel.off).to.be.a('function');
			expect(syncModel.emit).to.be.a('function');
		});

		it('Should call XQCore.Model init()', function() {
			var modelInitStub = sinon.stub(XQCore.Model.prototype, 'init');
			
			var syncModel = new XQCore.SyncModel('test');
			expect(modelInitStub).was.notCalled();
			syncModel.init();
			expect(modelInitStub).was.calledOnce();

			modelInitStub.restore();
		});
	});

	describe('connect', function() {
		it('Should connect to a socket server', function() {
			var sockJSStub = sinon.stub(window, 'SockJS');
			
			var syncModel = new XQCore.SyncModel('test');
			syncModel.init();

			expect(syncModel.socket).to.be.an('object');
			expect(sockJSStub).was.calledOnce();
			expect(sockJSStub).was.calledWith('http://' + document.domain + ':9999/xqmodel');

			sockJSStub.restore();
		});

		it('Should connect to a socket server once', function() {
			var sockJSStub = sinon.stub(window, 'SockJS');
			
			var syncModel = new XQCore.SyncModel('test');
			syncModel.init();
			syncModel.connectToSocket();

			expect(syncModel.socket).to.be.an('object');
			expect(sockJSStub).was.calledOnce();
			expect(sockJSStub).was.calledWith('http://' + document.domain + ':9999/xqmodel');

			sockJSStub.restore();
		});
	});

	describe('register', function() {
		var sockJSStub,
			syncModel;

		beforeEach(function() {
			sockJSStub = sinon.stub(window, 'SockJS');
			syncModel = new XQCore.SyncModel('synctest');
			syncModel.init();
		});

		afterEach(function() {
			sockJSStub.restore();
		});
		
		it('Should register a syncmodel, use model name as sync name', function() {
			var socketEmitStub = sinon.stub(syncModel.socket, 'emit');
			syncModel.register();

			expect(socketEmitStub).was.calledOnce();
			expect(socketEmitStub).was.calledWith('syncmodel.register', {
				name: 'synctest'
			});

			socketEmitStub.restore();
		});
		
		it('Should register a syncmodel, use syncWith property as sync name', function() {
			var socketEmitStub = sinon.stub(syncModel.socket, 'emit');
			syncModel.conf.syncWith = 'syncwith';
			syncModel.register();

			expect(socketEmitStub).was.calledOnce();
			expect(socketEmitStub).was.calledWith('syncmodel.register', {
				name: 'syncwith'
			});

			socketEmitStub.restore();
		});
		
		it('Should register a syncmodel.change listener', function() {
			var socketOnStub = sinon.stub(syncModel.socket, 'on');
			syncModel.register();

			expect(socketOnStub).was.calledOnce();
			expect(socketOnStub).was.calledWith('syncmodel.change', sinon.match.func);

			socketOnStub.restore();
		});

		it('Should handle a syncmodel.change event (replace)', function() {
			var setStub = sinon.stub(syncModel, 'set');
			var socketOnStub = sinon.stub(syncModel.socket, 'on');
			syncModel.register();
			socketOnStub.yield(['replace', {a: 'aa'}]);

			expect(setStub).was.calledOnce();
			expect(setStub).was.calledWith({a: 'aa'});

			socketOnStub.restore();
			setStub.restore();
		});

		it('Should handle a syncmodel.change event (item)', function() {
			var setStub = sinon.stub(syncModel, 'set');
			var socketOnStub = sinon.stub(syncModel.socket, 'on');
			syncModel.register();
			socketOnStub.yield(['replace', 'a', 'aa']);

			expect(setStub).was.calledOnce();
			expect(setStub).was.calledWith('a', 'aa');

			socketOnStub.restore();
			setStub.restore();
		});

		it('Should handle a syncmodel.change event (append)', function() {
			var setStub = sinon.stub(syncModel, 'append');
			var socketOnStub = sinon.stub(syncModel.socket, 'on');
			syncModel.register();
			socketOnStub.yield(['append', 'listing', {a: 'aa'}]);

			expect(setStub).was.calledOnce();
			expect(setStub).was.calledWith('listing', {a: 'aa'});

			socketOnStub.restore();
			setStub.restore();
		});

		it('Should handle a syncmodel.change event (prepend)', function() {
			var setStub = sinon.stub(syncModel, 'prepend');
			var socketOnStub = sinon.stub(syncModel.socket, 'on');
			syncModel.register();
			socketOnStub.yield(['prepend', 'listing', {a: 'aa'}]);

			expect(setStub).was.calledOnce();
			expect(setStub).was.calledWith('listing', {a: 'aa'});

			socketOnStub.restore();
			setStub.restore();
		});

		it('Should handle a syncmodel.change event (insert)', function() {
			var setStub = sinon.stub(syncModel, 'insert');
			var socketOnStub = sinon.stub(syncModel.socket, 'on');
			syncModel.register();
			socketOnStub.yield(['insert', 'listing', 1, {a: 'aa'}]);

			expect(setStub).was.calledOnce();
			expect(setStub).was.calledWith('listing', 1, {a: 'aa'});

			socketOnStub.restore();
			setStub.restore();
		});

		it('Should handle a syncmodel.change event (remove)', function() {
			var setStub = sinon.stub(syncModel, 'remove');
			var socketOnStub = sinon.stub(syncModel.socket, 'on');
			syncModel.register();
			socketOnStub.yield(['remove', 'listing', 1]);

			expect(setStub).was.calledOnce();
			expect(setStub).was.calledWith('listing', 1);

			socketOnStub.restore();
			setStub.restore();
		});
	});

	describe('unregister', function() {
		var sockJSStub,
			syncModel;

		beforeEach(function() {
			sockJSStub = sinon.stub(window, 'SockJS');
			syncModel = new XQCore.SyncModel('synctest');
			syncModel.init();
		});

		afterEach(function() {
			sockJSStub.restore();
		});
		
		it('Should unregister a syncmodel, use model name as sync name', function() {
			var socketEmitStub = sinon.stub(syncModel.socket, 'emit');
			syncModel.unregister();

			expect(socketEmitStub).was.calledOnce();
			expect(socketEmitStub).was.calledWith('syncmodel.unregister', {
				name: 'synctest'
			});

			socketEmitStub.restore();
		});
		
		it('Should unregister a syncmodel, use syncWith property as sync name', function() {
			var socketEmitStub = sinon.stub(syncModel.socket, 'emit');
			syncModel.conf.syncWith = 'syncwith';
			syncModel.unregister();

			expect(socketEmitStub).was.calledOnce();
			expect(socketEmitStub).was.calledWith('syncmodel.unregister', {
				name: 'syncwith'
			});

			socketEmitStub.restore();
		});
		
		it('Should remove a syncmodel.change listener', function() {
			var socketOffStub = sinon.stub(syncModel.socket, 'off');
			syncModel.unregister();

			expect(socketOffStub).was.calledOnce();
			expect(socketOffStub).was.calledWith('syncmodel.change');

			socketOffStub.restore();
		});
	});

	describe('emitRemote', function() {
		var sockJSStub,
			syncModel;

		beforeEach(function() {
			sockJSStub = sinon.stub(window, 'SockJS');
			syncModel = new XQCore.SyncModel('synctest');
			syncModel.init();
		});

		afterEach(function() {
			sockJSStub.restore();
		});

		it('Should send a socket call to the server', function() {
			var socketEmitStub = sinon.stub(syncModel.socket, 'emit');

			syncModel.emitRemote('test', {a: 'aa'});

			expect(socketEmitStub).was.calledOnce();
			expect(socketEmitStub).was.calledWith('test', {a:'aa'});
			
			socketEmitStub.restore();
		});
	});

	describe('sync', function() {
		var sockJSStub,
			syncModel;

		beforeEach(function() {
			sockJSStub = sinon.stub(window, 'SockJS');
			syncModel = new XQCore.SyncModel('synctest');
			syncModel.init();
		});

		afterEach(function() {
			sockJSStub.restore();
		});

		it('Should syncronize model with backend model', function() {
			var emitRemoteStub = sinon.stub(syncModel, 'emitRemote');
			
			syncModel.register(true);
			syncModel.sync('reset', {a: 'aa'});

			expect(emitRemoteStub).was.calledOnce();
			expect(emitRemoteStub).was.calledWith('syncmodel.change', ['reset', {a: 'aa'}]);

			emitRemoteStub.restore();
		});
	});
});