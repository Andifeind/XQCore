describe('XQCore.Event', function() {
    'use strict';

    describe('on', function() {
        var ee;

        beforeEach(function() {
            ee = new XQCore.Event();
        });

        it('Should register event listener', function() {
            var fn = sinon.stub();
            ee.on('test', fn);

            expect(ee._events.test).to.be.an('array');
            expect(ee._events.test).to.have.length(1);
            expect(ee._events.test[0].listener).to.equal(fn);
        });

        it('Should register multiple event listener', function() {
            var fn = sinon.stub();
            var fn2 = sinon.stub();
            var fn3 = sinon.stub();
            ee.on('test', fn);
            ee.on('test', fn2);
            ee.on('test', fn3);

            expect(ee._events.test).to.be.an('array');
            expect(ee._events.test).to.have.length(3);
            expect(ee._events.test[0].listener).to.equal(fn);
            expect(ee._events.test[1].listener).to.equal(fn2);
            expect(ee._events.test[2].listener).to.equal(fn3);
        });

        it('Should register multiple event listeners of different types', function() {
            var fn = sinon.stub();
            var fn2 = sinon.stub();
            var fn3 = sinon.stub();
            ee.on('test', fn);
            ee.on('test.bla', fn2);
            ee.on('test.blubb', fn3);

            expect(ee._events.test).to.be.an('array');
            expect(ee._events.test).to.have.length(1);
            expect(ee._events.test[0].listener).to.equal(fn);
            expect(ee._events['test.bla'][0].listener).to.equal(fn2);
            expect(ee._events['test.blubb'][0].listener).to.equal(fn3);
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

            expect(fn).was.calledOnce();
            expect(fn).was.calledWith({data: 'aa'});
        });

        it('Should emit an event twice', function() {
            var fn = sinon.stub();
            ee.on('test', fn);
            ee.emit('test', { data: 'aa'});

            expect(fn).was.calledOnce();
            expect(fn).was.calledWith({data: 'aa'});

            ee.emit('test', { data: 'bb'});
            
            expect(fn).was.calledTwice();
            expect(fn).was.calledWith({data: 'aa'});
            expect(fn).was.calledWith({data: 'bb'});
        });

        it('Should emit an unregistered event', function() {
            var fn = sinon.stub();
            ee.on('test', fn);
            ee.emit('test.bla', { data: 'aa'});

            expect(fn).was.notCalled();
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

            expect(ee._events.test).to.be.an('array');
            expect(ee._events.test).to.have.length(1);
            expect(ee._events.test[0].listener).to.equal(fn);

            ee.emit('test', 'aa');
            expect(fn).was.calledOnce();
            expect(fn).was.calledWith('aa');

            expect(ee._events.test).to.have.length(0);

            ee.emit('test', 'aa');
            expect(fn).was.calledOnce();
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

            expect(ee._events.test).to.be.an('array');
            expect(ee._events.test).to.have.length(1);
            expect(ee._events.test[0].listener).to.equal(fn);

            ee.emit('test', 'aa');
            expect(fn).was.calledOnce();
            expect(fn).was.calledWith('aa');

            ee.off('test', fn);
            expect(ee._events.test).to.have.length(0);

            ee.emit('test', 'aa');
            expect(fn).was.calledOnce();
        });

        it('Should unregister all event listeners of an event name', function() {
            var fn = sinon.stub();
            ee.on('test', fn);

            expect(ee._events.test).to.be.an('array');
            expect(ee._events.test).to.have.length(1);
            expect(ee._events.test[0].listener).to.equal(fn);

            ee.emit('test', 'aa');
            expect(fn).was.calledOnce();
            expect(fn).was.calledWith('aa');

            ee.off('test');
            expect(ee._events.test).to.be(undefined);

            ee.emit('test', 'aa');
            expect(fn).was.calledOnce();
        });
    });
});