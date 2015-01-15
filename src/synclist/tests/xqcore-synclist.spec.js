describe('SyncList', function() {
    'use strict';
    
    describe('instance', function() {
        var connectStub;
        
        before(function() {
            connectStub = sinon.stub(XQCore.Socket.prototype, 'connect');
        });

        after(function() {
             connectStub.restore();
        });

        it('Should be a SyncList prototype', function() {
            expect(XQCore.SyncList).to.be.a('function');
        });

        it('Should be inherited from List', function() {
            var socketStub = sinon.stub(XQCore.Socket.prototype, 'constructor');
            
            var syncList = new XQCore.SyncList();
            expect(syncList).to.be.a(XQCore.List);
            socketStub.restore();
        });

        it('Should connect to a socket server', function() {
            var syncList;
            var connectToSocketStub = sinon.stub(XQCore.SyncList.prototype, 'connectToSocket');
            
            syncList = new XQCore.SyncList();
            expect(connectToSocketStub).was.calledOnce();
            connectToSocketStub.restore();
        });
    });

    describe('connectToSocket', function() {
        var connectStub;
        
        beforeEach(function() {
            connectStub = sinon.stub(XQCore.Socket.prototype, 'connect');
        });

        afterEach(function() {
             connectStub.restore();
        });

        it('Should connect to a socket server', function() {
            var syncList;

            syncList = new XQCore.SyncList('test', {
                server: 'https://mysocket.net',
                port: 3434
            });

            expect(connectStub).was.calledOnce();
            expect(connectStub).was.calledWith('https://mysocket.net:3434/xqsocket/testlist');
        });

        it('Should connect to a socket server (Nameless List)', function() {
            var syncList;

            syncList = new XQCore.SyncList({
                server: 'https://mysocket.net',
                port: 3434
            });

            expect(connectStub).was.calledOnce();
            expect(connectStub).was.calledWith('https://mysocket.net:3434/xqsocket/namelesslist');
        });
    });

    describe('register', function() {
        var connectStub,
            emitStub,
            syncList;
        
        beforeEach(function() {
            connectStub = sinon.stub(XQCore.Socket.prototype, 'connect');
            emitStub = sinon.stub(XQCore.Socket.prototype, 'emit');
            syncList = new XQCore.SyncList('test');
        });

        afterEach(function() {
             connectStub.restore();
             emitStub.restore();
        });

        it('Should register a synclist on the socket server', function() {
            syncList.register();

            expect(emitStub).was.calledOnce();
            expect(emitStub).was.calledWith('synclist.register', {
                name: 'testList'
            });
        });

        it('Should log list registrations in debug level', function() {
            var debugStub = sinon.stub(syncList, 'dev');
            syncList.register();
            
            expect(debugStub).was.calledOnce();
            expect(debugStub).was.calledWith('Register synclist at server:', 'testList');
            debugStub.restore();
        });

        it('Should register listener for incoming changes', function() {
            var onStub = sinon.stub(syncList.socket, 'on');
            syncList.register();
            
            expect(onStub).was.callCount(4);
            expect(onStub).was.calledWith('synclist.push', sinon.match.func);
            expect(onStub).was.calledWith('synclist.unshift', sinon.match.func);
            expect(onStub).was.calledWith('synclist.pop', sinon.match.func);
            expect(onStub).was.calledWith('synclist.shift', sinon.match.func);

            onStub.restore();
        });
    });

    describe('unregister', function() {
        var connectStub,
            emitStub,
            syncList;
        
        beforeEach(function() {
            connectStub = sinon.stub(XQCore.Socket.prototype, 'connect');
            emitStub = sinon.stub(XQCore.Socket.prototype, 'emit');
            syncList = new XQCore.SyncList('test');
        });

        afterEach(function() {
             connectStub.restore();
             emitStub.restore();
        });

        it('Should unregister a synclist on the socket server', function() {
            syncList.unregister();

            expect(emitStub).was.calledOnce();
            expect(emitStub).was.calledWith('synclist.unregister', {
                name: 'testList'
            });
        });

        it('Should log list registrations in debug level', function() {
            var debugStub = sinon.stub(syncList, 'dev');
            syncList.unregister();
            
            expect(debugStub).was.calledOnce();
            expect(debugStub).was.calledWith('Unregister synclist at server:', 'testList');
            debugStub.restore();
        });

        it('Should unregister listener for incoming changes', function() {
            var offStub = sinon.stub(syncList.socket, 'off');
            syncList.unregister();
            
            expect(offStub).was.callCount(4);
            expect(offStub).was.calledWith('synclist.push');
            expect(offStub).was.calledWith('synclist.unshift');
            expect(offStub).was.calledWith('synclist.pop');
            expect(offStub).was.calledWith('synclist.shift');

            offStub.restore();
        });
    });

    describe('emitRemote', function() {
        var connectStub,
            syncList;

        beforeEach(function() {
            connectStub = sinon.stub(XQCore.Socket.prototype, 'connect');
            syncList = new XQCore.SyncList('test');
        });

        afterEach(function() {
             connectStub.restore();
        });

        it('Should send a socket call to the server', function() {
            var socketEmitStub = sinon.stub(syncList.socket, 'emit');

            syncList.emitRemote('test', {a: 'aa'});

            expect(socketEmitStub).was.calledOnce();
            expect(socketEmitStub).was.calledWith('test', {a:'aa'});
            
            socketEmitStub.restore();
        });
    });
});