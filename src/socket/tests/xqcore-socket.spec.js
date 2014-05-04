describe('XQCore.Socket', function() {
	beforeEach(function() {

	});

	afterEach(function() {

	});

	describe('constructor', function() {
		it('Should be a XQCore.Socket object', function() {
			expect(XQCore.Socket).to.be.a('function');
		});

		it('Should create an instance of XQCore.Socket', function() {
			var socket = new XQCore.Socket();
			expect(socket).to.be.a(XQCore.Socket);
		});
	});

	describe('connect', function() {
		var socket,
			SockJSStub;

		beforeEach(function() {
			socket = new XQCore.Socket();
			SockJSStub = sinon.stub(window, 'SockJS');
		});

		afterEach(function() {
			SockJSStub.restore();
		});

		it('Should connect to a socket server', function() {
			var url = 'http://test.lc',
				opts = {a: 'aa'};

			socket.connect(url, opts);
			expect(SockJSStub).was.calledOnce();
			expect(SockJSStub).was.calledWith(url, null, opts);
		});

		it('Should set ready state on connection was successful', function() {
			var url = 'http://test.lc',
				opts = {a: 'aa'},
				cb = sinon.stub();

			socket.connect(url, opts, cb);

			expect(socket.__isReady).to.be(false);
			socket.sockJS.onopen();
			expect(socket.__isReady).to.be(true);
			expect(cb).was.calledOnce();
		});

		it('Should call all queued ready functions', function() {
			socket.connect();
			var stub1 = sinon.stub();
			var stub2 = sinon.stub();

			expect(socket.__isReady).to.be(false);
			expect(socket.__onReadyCallbacks).to.eql([]);

			socket.ready(stub1);
			socket.ready(stub2);

			expect(socket.__onReadyCallbacks).to.eql([stub1, stub2]);

			//Make socket ready
			socket.sockJS.onopen();

			expect(socket.__isReady).to.be(true);
			expect(socket.__onReadyCallbacks).to.eql([]);
			expect(stub1).was.calledOnce();
			expect(stub2).was.calledOnce();
		});
	});

	describe('emit', function() {
		var socket,
			SockJSStub;

		beforeEach(function() {
			socket = new XQCore.Socket();
			SockJSStub = sinon.stub(window, 'SockJS');

			socket.connect();
			socket.sockJS.send = sinon.stub();

			//Make socket ready
			socket.sockJS.onopen();
		});

		afterEach(function() {
			SockJSStub.restore();
		});

		it('Should emit a message to the socket server', function() {
			socket.emit('test', {a:'test'});
			expect(socket.sockJS.send).was.calledOnce();
			expect(socket.sockJS.send).was.calledWith(JSON.stringify({
				eventName: 'test',
				data: {a:'test'}
			}));
		});
	});

	describe('on', function() {
		var socket,
			SockJSStub;

		beforeEach(function() {
			socket = new XQCore.Socket();
			SockJSStub = sinon.stub(window, 'SockJS');

			socket.connect();
			socket.sockJS.send = sinon.stub();

			//Make socket ready
			socket.sockJS.onopen();
		});

		afterEach(function() {
			SockJSStub.restore();
		});

		it('Should listen for an incoming socket message', function() {
			var onStub = sinon.stub();
			socket.on('test', onStub);

			//Emit a incoming socket message
			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test',
					data: {a:'test'}
				})
			});

			expect(onStub).was.calledOnce();
			expect(onStub).was.calledWith({a: 'test'});
		});

		it('Should listen for multiple socket messages', function() {
			var onStub = sinon.stub();
			socket.on('test', onStub);

			//Emit a incoming socket message
			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test',
					data: {a:'test'}
				})
			});

			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test',
					data: {a:'test2'}
				})
			});

			expect(onStub).was.calledTwice();
			expect(onStub).was.calledWith({a: 'test'});
			expect(onStub).was.calledWith({a: 'test2'});
		});

		it('Should listen for different socket messages', function() {
			var onStub = sinon.stub(),
				onStub2 = sinon.stub();

			socket.on('test', onStub);
			socket.on('test2', onStub2);

			//Emit a incoming socket message
			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test',
					data: {a:'test'}
				})
			});

			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test2',
					data: {a:'test2'}
				})
			});

			expect(onStub).was.calledOnce();
			expect(onStub2).was.calledOnce();
			expect(onStub).was.calledWith({a: 'test'});
			expect(onStub2).was.calledWith({a: 'test2'});
		});
	});

	describe('once', function() {
		var socket,
			SockJSStub;

		beforeEach(function() {
			socket = new XQCore.Socket();
			SockJSStub = sinon.stub(window, 'SockJS');

			socket.connect();
			socket.sockJS.send = sinon.stub();

			//Make socket ready
			socket.sockJS.onopen();
		});

		afterEach(function() {
			SockJSStub.restore();
		});

		it('Should listen for an incoming socket message once', function() {
			var onStub = sinon.stub();
			socket.once('test', onStub);

			//Emit a incoming socket message
			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test',
					data: {a:'test'}
				})
			});

			expect(onStub).was.calledOnce();
			expect(onStub).was.calledWith({a: 'test'});
		});

		it('Should listen for multiple socket messages once', function() {
			var onStub = sinon.stub();
			socket.once('test', onStub);

			//Emit a incoming socket message
			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test',
					data: {a:'test'}
				})
			});

			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test',
					data: {a:'test2'}
				})
			});

			expect(onStub).was.calledOnce();
			expect(onStub).was.calledWith({a: 'test'});
		});

		it('Should listen for different socket messages once', function() {
			var onStub = sinon.stub(),
				onStub2 = sinon.stub();

			socket.once('test', onStub);
			socket.once('test2', onStub2);

			//Emit a incoming socket message
			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test',
					data: {a:'test'}
				})
			});

			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test2',
					data: {a:'test2'}
				})
			});

			expect(onStub).was.calledOnce();
			expect(onStub2).was.calledOnce();
			expect(onStub).was.calledWith({a: 'test'});
			expect(onStub2).was.calledWith({a: 'test2'});
		});
	});

	describe('off', function() {
		var socket,
			SockJSStub;

		beforeEach(function() {
			socket = new XQCore.Socket();
			SockJSStub = sinon.stub(window, 'SockJS');

			socket.connect();
			socket.sockJS.send = sinon.stub();

			//Make socket ready
			socket.sockJS.onopen();
		});

		afterEach(function() {
			SockJSStub.restore();
		});

		it('Should unregister a listener', function() {
			var onStub = sinon.stub();
			socket.on('test', onStub);
			socket.off('test', onStub);

			//Emit a incoming socket message
			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test',
					data: {a:'test'}
				})
			});

			expect(onStub).was.notCalled();
		});

		it('Should listen for multiple socket messages', function() {
			var onStub = sinon.stub();
			socket.on('test', onStub);

			//Emit a incoming socket message
			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test',
					data: {a:'test'}
				})
			});

			socket.off('test', onStub);

			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test',
					data: {a:'test2'}
				})
			});

			expect(onStub).was.calledOnce();
			expect(onStub).was.calledWith({a: 'test'});
		});

		it('Should listen for different socket messages', function() {
			var onStub = sinon.stub(),
				onStub2 = sinon.stub();

			socket.on('test', onStub);
			socket.on('test2', onStub2);
			socket.off('test', onStub);

			//Emit a incoming socket message
			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test',
					data: {a:'test'}
				})
			});

			socket.sockJS.onmessage({
				data: JSON.stringify({
					eventName: 'test2',
					data: {a:'test2'}
				})
			});

			expect(onStub).was.notCalled();
			expect(onStub2).was.calledOnce();
			expect(onStub2).was.calledWith({a: 'test2'});
		});
	});
});