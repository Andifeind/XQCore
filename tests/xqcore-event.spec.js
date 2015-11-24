describe('XQCore.Event', function() {
    'use strict';

    describe('Object', function() {
        it('Should be an Event object', function() {
            expect(XQCore.Event).to.be.a('function');
        });

        it('Should hav an on method', function() {
            expect(XQCore.Event.prototype.on).to.be.a('function');
        });

        it('Should hav an once method', function() {
            expect(XQCore.Event.prototype.once).to.be.a('function');
        });

        it('Should hav an emit method', function() {
            expect(XQCore.Event.prototype.emit).to.be.a('function');
        });

        it('Should hav an off method', function() {
            expect(XQCore.Event.prototype.off).to.be.a('function');
        });

        it('Should hav an clearEvents method', function() {
            expect(XQCore.Event.prototype.clearEvents).to.be.a('function');
        });
    });

    describe('on', function() {
        var ee;

        beforeEach(function() {
            ee = new XQCore.Event();
        });

        it('Should register event listener', function() {
            var fn = sinon.stub();
            ee.on('test', fn);

            expect(ee.__events.test).to.be.an('array');
            expect(ee.__events.test).to.have.length(1);
            expect(ee.__events.test[0].fn).to.equal(fn);
        });

        it('Should register multiple event listener', function() {
            var fn = sinon.stub();
            var fn2 = sinon.stub();
            var fn3 = sinon.stub();
            ee.on('test', fn);
            ee.on('test', fn2);
            ee.on('test', fn3);

            expect(ee.__events.test).to.be.an('array');
            expect(ee.__events.test).to.have.length(3);
            expect(ee.__events.test[0].fn).to.equal(fn);
            expect(ee.__events.test[1].fn).to.equal(fn2);
            expect(ee.__events.test[2].fn).to.equal(fn3);
        });

        it('Should register multiple event listeners of different types', function() {
            var fn = sinon.stub();
            var fn2 = sinon.stub();
            var fn3 = sinon.stub();
            ee.on('test', fn);
            ee.on('test.bla', fn2);
            ee.on('test.blubb', fn3);

            expect(ee.__events.test).to.be.an('array');
            expect(ee.__events.test).to.have.length(1);
            expect(ee.__events.test[0].fn).to.equal(fn);
            expect(ee.__events['test.bla'][0].fn).to.equal(fn2);
            expect(ee.__events['test.blubb'][0].fn).to.equal(fn3);
        });
    });

    describe('emit', function() {
        var ee;

        beforeEach(function() {
            ee = new XQCore.Event();
        });

        it('Should emit an event', function() {
            var fn = sinon.stub();
            ee.on('test', fn);
            ee.emit('test', { data: 'aa'});

            expect(fn).to.be.calledOnce();
            expect(fn).to.be.calledWith({data: 'aa'});
        });

        it('Should emit an event and should return num of called listeners', function() {
            var fn = sinon.stub();
            ee.on('test', fn);
            var len = ee.emit('test', { data: 'aa'});

            expect(len).to.be(1);
        });

        it('Should emit an event twice', function() {
            var fn = sinon.stub();
            ee.on('test', fn);
            ee.emit('test', { data: 'aa'});

            expect(fn).to.be.calledOnce();
            expect(fn).to.be.calledWith({data: 'aa'});

            ee.emit('test', { data: 'bb'});
            
            expect(fn).to.be.calledTwice();
            expect(fn).to.be.calledWith({data: 'aa'});
            expect(fn).to.be.calledWith({data: 'bb'});
        });

        it('Should emit an unregistered event', function() {
            var fn = sinon.stub();
            ee.on('test', fn);
            ee.emit('test.bla', { data: 'aa'});

            expect(fn).to.be.notCalled();
        });

        it('Should increase the emit counter', function() {
            var fn = sinon.stub();
            var listener = ee.on('test', fn);

            ee.emit('test', { data: 'aa'});
            expect(listener.calls).to.be(1);

            ee.emit('test', { data: 'bb'});
            expect(listener.calls).to.be(2);
        });
    });

    describe('once', function() {
        var ee;

        beforeEach(function() {
            ee = new XQCore.Event();
        });

        it('Should register an event listener only once', function() {
            var fn = sinon.stub();
            ee.once('test', fn);

            expect(ee.__events.test).to.be.an('array');
            expect(ee.__events.test).to.have.length(1);
            expect(ee.__events.test[0].fn).to.equal(fn);

            ee.emit('test', 'aa');
            expect(fn).to.be.calledOnce();
            expect(fn).to.be.calledWith('aa');

            expect(ee.__events.test).to.have.length(0);

            ee.emit('test', 'aa');
            expect(fn).to.be.calledOnce();
        });

        it('Should register an event listener multiple times', function() {
            var fn = sinon.stub();
            var fn2 = sinon.stub();
            var fn3 = sinon.stub();
            ee.on('test', fn);
            ee.once('test', fn2);
            ee.on('test', fn3);

            expect(ee.__events.test).to.be.an('array');
            expect(ee.__events.test).to.have.length(3);
            expect(ee.__events.test[0].fn).to.equal(fn);
            expect(ee.__events.test[1].fn).to.equal(fn2);
            expect(ee.__events.test[2].fn).to.equal(fn3);

            ee.emit('test', 'aa');
            expect(fn).to.be.calledOnce();
            expect(fn2).to.be.calledOnce();
            expect(fn3).to.be.calledOnce();
            expect(fn).to.be.calledWith('aa');
            expect(fn2).to.be.calledWith('aa');
            expect(fn3).to.be.calledWith('aa');

            expect(ee.__events.test).to.have.length(2);

            ee.emit('test', 'aa');
            expect(fn).to.be.calledTwice();
            expect(fn2).to.be.calledOnce();
            expect(fn3).to.be.calledTwice();
        });
    });

    describe('off', function() {
        var ee;

        beforeEach(function() {
            ee = new XQCore.Event();
        });

        it('Should unregister an event listener', function() {
            var fn = sinon.stub();
            ee.on('test', fn);

            expect(ee.__events.test).to.be.an('array');
            expect(ee.__events.test).to.have.length(1);
            expect(ee.__events.test[0].fn).to.equal(fn);

            ee.emit('test', 'aa');
            expect(fn).to.be.calledOnce();
            expect(fn).to.be.calledWith('aa');

            ee.off('test', fn);
            expect(ee.__events.test).to.be(undefined);

            ee.emit('test', 'aa');
            expect(fn).to.be.calledOnce();
        });

        it('Should unregister events with the same listener func', function() {
            var fn = sinon.stub();
            var fn2 = sinon.stub();
            ee.on('test', fn);
            ee.on('test', fn2);

            expect(ee.__events.test).to.be.an('array');
            expect(ee.__events.test).to.have.length(2);
            expect(ee.__events.test[0].fn).to.equal(fn);
            expect(ee.__events.test[1].fn).to.equal(fn2);

            ee.emit('test', 'aa');
            expect(fn).to.be.calledOnce();
            expect(fn2).to.be.calledOnce();
            expect(fn).to.be.calledWith('aa');
            expect(fn2).to.be.calledWith('aa');

            ee.off('test', fn);
            expect(ee.__events.test).to.have.length(1);
            expect(ee.__events.test[0].fn).to.equal(fn2);

            ee.emit('test', 'aa');
            expect(fn).to.be.calledOnce();
            expect(fn2).to.be.calledTwice();
        });

        it('Should unregister all event listeners of an event name', function() {
            var fn = sinon.stub();
            var fn2 = sinon.stub();
            ee.on('test', fn);
            ee.on('test', fn2);

            expect(ee.__events.test).to.be.an('array');
            expect(ee.__events.test).to.have.length(2);
            expect(ee.__events.test[0].fn).to.equal(fn);

            ee.emit('test', 'aa');
            expect(fn).to.be.calledOnce();
            expect(fn).to.be.calledWith('aa');

            ee.off('test');
            expect(ee.__events.test).to.be(undefined);

            ee.emit('test', 'aa');
            expect(fn).to.be.calledOnce();
        });

        it('Should return the number of removed listeners, remove all', function() {
            var fn = sinon.stub();
            var fn2 = sinon.stub();
            ee.on('test', fn);
            ee.on('test', fn2);

            var len = ee.off('test');
            expect(len).to.be(2);
        });

        it('Should return the number of removed listeners, remove one', function() {
            var fn = sinon.stub();
            var fn2 = sinon.stub();
            ee.on('test', fn);
            ee.on('test', fn2);

            var len = ee.off('test', fn);
            expect(len).to.be(1);
        });

        it('Should return the number of removed listeners, remove none', function() {
            var fn = sinon.stub();
            var fn2 = sinon.stub();
            ee.on('test', fn);
            ee.on('test', fn2);

            var len = ee.off('test-bla', fn);
            expect(len).to.be(0);
        });
    });

    describe('clearEvents', function() {
        var ee;

        beforeEach(function() {
            ee = new XQCore.Event();
        });

        it('Should remove all registered events', function() {
            var fn = sinon.stub();
            var fn2 = sinon.stub();
            ee.on('test', fn);
            ee.on('test', fn2);

            expect(ee.__events.test).to.be.an('array');
            expect(ee.__events.test).to.have.length(2);
            ee.clearEvents();

            expect(ee.__events).to.eql({});
        });
    });

    describe('maxLength', function() {
        var ee;

        beforeEach(function() {
            ee = new XQCore.Event();
            ee.maxLength = 3;
        });

        it('Should warn if listener max length was exceeded', function() {
            var warnStub = sinon.stub(ee.__logger, 'warn');

            var fn = sinon.stub();

            ee.on('test', fn);
            ee.on('test', fn);
            ee.on('test', fn);
            
            expect(warnStub).to.be.notCalled();
            ee.on('test', fn);

            expect(warnStub).to.be.calledOnce();
            expect(warnStub).to.be.calledWith('Listener max length was exceeded!', 'List:', 'test', 'Length:', 4);

            warnStub.restore();
        });

        it('Should set maxlength by a global property', function() {
            XQCore.eventListenerMaxLength = 5;
            ee = new XQCore.Event();

            expect(ee.maxLength).to.be(5);
        });
    });

    describe('logger', function() {
        var ee,
            logStub,
            debugStub;
            

        beforeEach(function() {
            ee = new XQCore.Event();
            ee.maxLength = 3;

            logStub = sinon.stub(ee.__logger, 'info');
            debugStub = sinon.stub(ee.__logger, 'debug');
        });

        afterEach(function() {
            logStub.restore();    
            debugStub.restore();    
        });

        it('Should log each registration of an event', function() {
            ee.on('test', function() {});
            expect(logStub).to.be.calledOnce();
            expect(logStub).to.be.calledWith('Register new `test` event');
            
            logStub.restore();
        });

        it('Should log each emit call of an event', function() {
            ee.on('test', function() {});
            logStub.reset();

            ee.emit('test', { a: 'aa' });
            expect(logStub).to.be.calledOnce();
            expect(debugStub).to.be.calledOnce();
            expect(logStub).to.be.calledWith('Emit `test` event to', 1, 'listener');
            expect(debugStub).to.be.calledWith(' ... data:', { a: 'aa' });
        });

        it('Should log an emit failed message if no event of this type were registered', function() {
            ee.on('test', function() {});
            logStub.reset();

            ee.emit('test-foo', function() {});
            expect(logStub).to.be.calledOnce();
            expect(logStub).to.be.calledWith('Emit `test-foo` event failed! No listener of this type are registered');
        });

        it('Should log each off call of an event', function() {
            ee.on('test', function() {});
            logStub.reset();

            ee.off('test');
            expect(logStub).to.be.calledOnce();
            expect(logStub).to.be.calledWith('Unregister `test` events!', 'Removed 1 listener');
        });

        it('Should log each off call failed message', function() {
            ee.on('test', function() {});
            logStub.reset();

            ee.off('test-foo');
            expect(logStub).to.be.calledOnce();
            expect(logStub).to.be.calledWith('Unregister events failed! No `test-foo` events were found!');
        });
    });
});