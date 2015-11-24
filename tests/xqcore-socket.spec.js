describe('XQCore.Socket', function() {
    'use strict';

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
        var socket;

        beforeEach(function() {
            
        });

        it('Should connect to a socket server', function() {
            var url = 'http://test.lc';

            var SocketConnectionStub = sinon.spy(XQCore, 'SocketConnection');
            

            socket = new XQCore.Socket(url, 'test');
            expect(SocketConnectionStub).to.be.calledOnce();
            expect(SocketConnectionStub).to.be.calledWith(url);
            SocketConnectionStub.restore();
        });
    });

    describe.skip('emit', function() {
        var socket;

        beforeEach(function() {
            socket = new XQCore.Socket();
            socket.setReady();

            socket.connect();

            //Make socket ready
            socket.sockJS.onopen();
        });

        it('Should emit a message to the socket server', function() {
            socket.emit('test', {a:'test'});
            expect(socket.sockJS.send).to.be.calledOnce();
            expect(socket.sockJS.send).to.be.calledWith(JSON.stringify({
                eventName: 'test',
                args: [{a:'test'}]
            }));
        });

        it('Should emit a message to the socket server with to args', function() {
            socket.emit('test', {a:'test'}, {b:'test'});
            expect(socket.sockJS.send).to.be.calledOnce();
            expect(socket.sockJS.send).to.be.calledWith(JSON.stringify({
                eventName: 'test',
                args: [{a:'test'},{b:'test'}]
            }));
        });
    });

    describe.skip('on', function() {
        var socket;

        beforeEach(function() {
            socket = new XQCore.Socket();
            socket.connect();
            socket.setReady();
        });

        it('Should listen for an incoming socket message', function() {
            var onStub = sinon.stub();
            socket.on('test', onStub);

            //Emit a incoming socket message
            socket.sockJS.onmessage({
                data: JSON.stringify({
                    eventName: 'test',
                    args: [{a:'test'}]
                })
            });

            expect(onStub).to.be.calledOnce();
            expect(onStub).to.be.calledWith({a: 'test'});
        });

        it('Should listen for an incoming socket message with two args', function() {
            var onStub = sinon.stub();
            socket.on('test', onStub);

            //Emit a incoming socket message
            socket.sockJS.onmessage({
                data: JSON.stringify({
                    eventName: 'test',
                    args: [{a:'test'},{b:'test'}]
                })
            });

            expect(onStub).to.be.calledOnce();
            expect(onStub).to.be.calledWith({a: 'test'},{b: 'test'});
        });

        it('Should listen for multiple socket messages', function() {
            var onStub = sinon.stub();
            socket.on('test', onStub);

            //Emit a incoming socket message
            socket.sockJS.onmessage({
                data: JSON.stringify({
                    eventName: 'test',
                    args: [{a:'test'}]
                })
            });

            socket.sockJS.onmessage({
                data: JSON.stringify({
                    eventName: 'test',
                    args: [{a:'test2'}]
                })
            });

            expect(onStub).to.be.calledTwice();
            expect(onStub).to.be.calledWith({a: 'test'});
            expect(onStub).to.be.calledWith({a: 'test2'});
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
                    args: [{a:'test'}]
                })
            });

            socket.sockJS.onmessage({
                data: JSON.stringify({
                    eventName: 'test2',
                    args: [{a:'test2'}]
                })
            });

            expect(onStub).to.be.calledOnce();
            expect(onStub2).to.be.calledOnce();
            expect(onStub).to.be.calledWith({a: 'test'});
            expect(onStub2).to.be.calledWith({a: 'test2'});
        });
    });

    describe.skip('once', function() {
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
                    args: [{a:'test'}]
                })
            });

            expect(onStub).to.be.calledOnce();
            expect(onStub).to.be.calledWith({a: 'test'});
        });

        it('Should listen for multiple socket messages once', function() {
            var onStub = sinon.stub();
            socket.once('test', onStub);

            //Emit a incoming socket message
            socket.sockJS.onmessage({
                data: JSON.stringify({
                    eventName: 'test',
                    args: [{a:'test'}]
                })
            });

            socket.sockJS.onmessage({
                data: JSON.stringify({
                    eventName: 'test',
                    args: [{a:'test2'}]
                })
            });

            expect(onStub).to.be.calledOnce();
            expect(onStub).to.be.calledWith({a: 'test'});
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
                    args: [{a:'test'}]
                })
            });

            socket.sockJS.onmessage({
                data: JSON.stringify({
                    eventName: 'test2',
                    args: [{a:'test2'}]
                })
            });

            expect(onStub).to.be.calledOnce();
            expect(onStub2).to.be.calledOnce();
            expect(onStub).to.be.calledWith({a: 'test'});
            expect(onStub2).to.be.calledWith({a: 'test2'});
        });
    });

    describe.skip('off', function() {
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
                    args: [{a:'test'}]
                })
            });

            expect(onStub).to.be.notCalled();
        });

        it('Should listen for multiple socket messages', function() {
            var onStub = sinon.stub();
            socket.on('test', onStub);

            //Emit a incoming socket message
            socket.sockJS.onmessage({
                data: JSON.stringify({
                    eventName: 'test',
                    args: [{a:'test'}]
                })
            });

            socket.off('test', onStub);

            socket.sockJS.onmessage({
                data: JSON.stringify({
                    eventName: 'test',
                    args: [{a:'test2'}]
                })
            });

            expect(onStub).to.be.calledOnce();
            expect(onStub).to.be.calledWith({a: 'test'});
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
                    args: [{a:'test'}]
                })
            });

            socket.sockJS.onmessage({
                data: JSON.stringify({
                    eventName: 'test2',
                    args: [{a:'test2'}]
                })
            });

            expect(onStub).to.be.notCalled();
            expect(onStub2).to.be.calledOnce();
            expect(onStub2).to.be.calledWith({a: 'test2'});
        });
    });
});