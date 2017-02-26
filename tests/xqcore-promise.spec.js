/*global XQCore:false */
'use strict';

describe('Promise', function() {
    describe('instance', function() {
        var XQPromise;

        beforeEach(function() {
            XQPromise = XQCore.Promise;
        });

        it('Should be an instance of promise', function() {
            expect(XQPromise).to.be.a('function');
        });

        it('Should have a then method', function() {
          expect(XQPromise.prototype.then).to.be.a('function');
        });

        it('Should have a catch method', function() {
          expect(XQPromise.prototype.catch).to.be.a('function');
        });
    });

    describe('resolve', function() {
        var XQPromise;

        beforeEach(function() {
            XQPromise = XQCore.Promise;
        });

        it('Should resolve a promise', function(done) {
            var thenStub = sinon.stub();
            var catchStub = sinon.stub();

            var p = new XQPromise(function(resolve, reject) {
                setTimeout(function() {
                    resolve({
                        a: 'test'
                    });

                    expect(thenStub).to.be.calledOnce();
                    expect(thenStub).to.be.calledWith({
                        a: 'test'
                    });

                    expect(catchStub).to.be.notCalled();

                    done();
                }, 0);
            });

            p.then(thenStub);
            p.catch(catchStub);
        });

        it('Should resolve a promise and trigger multiple then blocks in series', function(done) {
            var thenStub = sinon.stub();
            var thenStub2 = sinon.stub();
            var thenStub3 = sinon.stub();
            var catchStub = sinon.stub();

            var p = new XQPromise(function(resolve, reject) {
                setTimeout(function() {
                    resolve({
                        a: 'test'
                    });

                    expect(thenStub).to.be.calledOnce();
                    expect(thenStub).to.be.calledWith({
                        a: 'test'
                    });

                    expect(thenStub2).to.be.calledWith({
                        a: 'test'
                    });

                    expect(thenStub3).to.be.calledWith({
                        a: 'test'
                    });

                    expect(catchStub).to.be.notCalled();

                    expect(thenStub2).to.be.calledAfter(thenStub);
                    expect(thenStub3).to.be.calledAfter(thenStub2);

                    done();
                }, 0);
            });

            p.then(thenStub);
            p.then(thenStub2);
            p.then(thenStub3);
            p.catch(catchStub);
        });

        it('Should define a promise as a chain', function(done) {
            var thenStub = sinon.stub();
            var thenStub2 = sinon.stub();
            var thenStub3 = sinon.stub();
            var catchStub = sinon.stub();

            var p = new XQPromise(function(resolve, reject) {
                setTimeout(function() {
                    resolve({
                        a: 'test'
                    });

                    expect(thenStub).to.be.calledOnce();
                    expect(thenStub).to.be.calledWith({
                        a: 'test'
                    });

                    expect(thenStub2).to.be.calledWith({
                        a: 'test'
                    });

                    expect(thenStub3).to.be.calledWith({
                        a: 'test'
                    });

                    expect(catchStub).to.be.notCalled();

                    expect(thenStub2).to.be.calledAfter(thenStub);
                    expect(thenStub3).to.be.calledAfter(thenStub2);

                    done();
                }, 0);
            });

            p.then(thenStub)
            .then(thenStub2)
            .then(thenStub3)
            .catch(catchStub);
        });
    });


    describe('reject', function() {
        var XQPromise;

        beforeEach(function() {
            XQPromise = XQCore.Promise;
        });

        it('Should reject a promise', function(done) {
            var thenStub = sinon.stub();
            var catchStub = sinon.stub();

            var p = new XQPromise(function(resolve, reject) {
                setTimeout(function() {
                    reject({
                        msg: 'test'
                    });

                    expect(catchStub).to.be.calledOnce();
                    expect(catchStub).to.be.calledWith({
                        msg: 'test'
                    });

                    expect(thenStub).to.be.notCalled();

                    done();
                }, 0);
            });

            p.then(thenStub);
            p.catch(catchStub);
        });
    });

    describe('static resolve', function() {
        var XQPromise;

        beforeEach(function() {
            XQPromise = XQCore.Promise;
        });

        it('Should reject a promise', function() {
            var thenStub = sinon.stub();
            var catchStub = sinon.stub();

            var p = XQPromise.resolve({
                msg: 'test'
            });

            p.then(thenStub);
            p.catch(catchStub);

            expect(thenStub).to.be.calledOnce();
            expect(thenStub).to.be.calledWith({
                msg: 'test'
            });

            expect(catchStub).to.be.notCalled();
        });
    });

    
    describe('static reject', function() {
        var XQPromise;

        beforeEach(function() {
            XQPromise = XQCore.Promise;
        });

        it('Should reject a promise', function() {
            var thenStub = sinon.stub();
            var catchStub = sinon.stub();

            var p = XQPromise.reject({
                err: 'test'
            });

            p.then(thenStub);
            p.catch(catchStub);

            expect(catchStub).to.be.calledOnce();
            expect(catchStub).to.be.calledWith({
                err: 'test'
            });

            expect(thenStub).to.be.notCalled();
        });
    });
});