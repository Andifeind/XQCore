describe.only('XQCore Router', function() {
    'use strict';

    describe('instance', function() {
        it('Should be a Router class', function() {
            expect(XQCore.Router).to.be.a('function');
        });

        it('Should have a addRoute method', function() {
            expect(XQCore.Router.prototype.addRoute).to.be.a('function');
        });

        it('Should have a removeRoute method', function() {
            expect(XQCore.Router.prototype.removeRoute).to.be.a('function');
        });

        it('Should have a router object', function() {
            var router = new XQCore.Router(false);
            expect(router.routes).to.be.an('array');
        });
    });

    describe('addRoute', function() {
        var router;

        beforeEach(function() {
            router = new XQCore.Router({ noListener: true });    
        });
        
        it('Should add new routes', function() {
            var fn = sinon.stub();
            router.addRoute('/test', fn);

            expect(router.routes).to.be.an('array');
            expect(router.routes).to.have.length(1);

            expect(router.routes[0].fn).to.equal(fn);
        });
        
        it('Should add multiple routes', function() {
            var fn = sinon.stub(),
                fn2 = sinon.stub(),
                fn3 = sinon.stub();

            router
                .addRoute('/test/:foo/:bar', fn)
                .addRoute('/test/:foo', fn2)
                .addRoute('/test', fn3);

            expect(router.routes).to.be.an('array');
            expect(router.routes).to.have.length(3);

            expect(router.routes[0].fn).to.equal(fn);
            expect(router.routes[1].fn).to.equal(fn2);
            expect(router.routes[2].fn).to.equal(fn3);
        });
    });

    describe('removeRoute', function() {
        var router;

        beforeEach(function() {
            router = new XQCore.Router({ noListener: true });    
        });

        it('Should remove a route', function() {
            var fn = sinon.stub(),
                fn2 = sinon.stub(),
                fn3 = sinon.stub();

            router
                .addRoute('/test/:foo/:bar', fn)
                .addRoute('/test/:foo', fn2)
                .addRoute('/test', fn3);

            expect(router.routes).to.be.an('array');
            expect(router.routes).to.have.length(3);

            router.removeRoute('/test/:foo');
            
            expect(router.routes).to.have.length(2);
            expect(router.routes[0].fn).to.equal(fn);
            expect(router.routes[1].fn).to.equal(fn3);
        });

        it('Should remove a non existing route', function() {
            var fn = sinon.stub(),
                fn2 = sinon.stub(),
                fn3 = sinon.stub();

            router
                .addRoute('/test/:foo/:bar', fn)
                .addRoute('/test/:foo', fn2)
                .addRoute('/test', fn3);

            expect(router.routes).to.be.an('array');
            expect(router.routes).to.have.length(3);

            router.removeRoute('/bla/:foo');
            
            expect(router.routes).to.have.length(3);
        });
    });

    describe('callRoute', function() {
        var router;

        beforeEach(function() {
            router = new XQCore.Router({ noListener: true });    
        });

        it('Should call a route', function() {
            var fn = sinon.stub(),
                fn2 = sinon.stub(),
                fn3 = sinon.stub();

            router
                .addRoute('/test/:foo/:bar', fn)
                .addRoute('/test/:foo', fn2)
                .addRoute('/test', fn3);

            router.callRoute('/test');

            expect(fn3).to.be.calledOnce();
            expect(fn3).to.be.calledWith({});
            expect(fn3.getCall(0).thisValue).to.be.equal(router);
        });

        it('Should routes with optional params', function() {
            var fn = sinon.stub(),
                fn2 = sinon.stub(),
                fn3 = sinon.stub();

            router
                .addRoute('/test/:foo/:bar', fn)
                .addRoute('/test/:foo?', fn2)
                .addRoute('/test', fn3);

            router.callRoute('/test/');
            router.callRoute('/test/blubb');

            expect(fn2).to.be.calledTwice();
            expect(fn2).to.be.calledWith({ foo: undefined});
            expect(fn2).to.be.calledWith({ foo: 'blubb'});
            expect(fn2.getCall(0).thisValue).to.be.equal(router);
        });
    });

    describe('registerListener', function() {
        it('Should register a popstate event', function() {
            XQCore.html5Routes = true;
            var router = new XQCore.Router({ noListener: true });
            var fn = sinon.stub();

            router.addRoute('/test/:foo/:bar', fn);

            var getPathStub = sinon.stub(router, 'getPath');
            //Simulating a push state event
            getPathStub.returns('/test/bla/blubb');

            router.onPopStateHandler({});

            expect(fn).to.be.calledOnce();
            expect(fn).to.be.calledWith({
                foo: 'bla',
                bar: 'blubb'
            });

            getPathStub.restore();
        });

        it('Should register a hashchange event', function() {
            XQCore.html5Routes = false;
            var router = new XQCore.Router({ noListener: true });
            var fn = sinon.stub();

            router.addRoute('/test/:foo/:bar', fn);

            var getPathStub = sinon.stub(router, 'getPath');
            //Simulating a push state event
            getPathStub.returns('/test/bla/blubb');

            router.onPopStateHandler({});

            expect(fn).to.be.calledOnce();
            expect(fn).to.be.calledWith({
                foo: 'bla',
                bar: 'blubb'
            });
            
            getPathStub.restore();
        });
    });
});