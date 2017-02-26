describe('XQCore Presenter', function() {
    'use strict';

    describe('initialize', function() {
        it('Should initialize a presenter', function() {
            var presenter,
                initFunc = sinon.stub();

            presenter = new XQCore.Presenter('Test I', initFunc);

            expect(presenter).to.be.a(XQCore.Presenter);
            expect(presenter.name).to.eql('Test I');
            expect(initFunc).to.be.calledOnce();
        });

        it('Should call init func with instance and logger as args', function() {
            var presenter,
                initFunc = sinon.stub();

            presenter = new XQCore.Presenter('Test I', initFunc);

            expect(presenter).to.be.a(XQCore.Presenter);
            expect(presenter.name).to.eql('Test I');
            expect(initFunc.firstCall.args[0]).to.equal(presenter);
            expect(initFunc.firstCall.args[1]).to.be.a(XQCore.Logger);
            expect(initFunc.firstCall.args[1].loggerName).to.eql('Test IPresenter');
        });

        it('Should set a default presenter name', function() {
            var presenter = new XQCore.Presenter();
            expect(presenter.name).to.equal('Nameless');
        });

        it('Should change a log level', function() {
            var logger;
            var presenter;
            presenter = new XQCore.Presenter('Test', function(self, log) {
                log.logLevel = -1;
                logger = log;
            });

            expect(logger.logLevel).to.eql(-1);
        });
    });

    describe('couple', function() {
        it('Should couple a model and a view', function() {
            var presenter = new XQCore.Presenter('test');
            var model = new XQCore.Model('test');
            var view = new XQCore.View('test');

            var coupleModelStub = sinon.stub(presenter, 'coupleModel');
            var coupleListStub = sinon.stub(presenter, 'coupleList');
            var coupleViewStub = sinon.stub(presenter, 'coupleView');

            presenter.couple(view, model);

            expect(coupleModelStub).to.be.calledOnce();
            expect(coupleListStub).to.be.notCalled();
            expect(coupleViewStub).to.be.calledOnce();

            coupleModelStub.restore();
            coupleListStub.restore();
            coupleViewStub.restore();
       });

        it('Should couple a list and a view', function() {
            var presenter = new XQCore.Presenter('test');
            var list = new XQCore.List('test');
            var view = new XQCore.View('test');

            var coupleModelStub = sinon.stub(presenter, 'coupleModel');
            var coupleListStub = sinon.stub(presenter, 'coupleList');
            var coupleViewStub = sinon.stub(presenter, 'coupleView');

            presenter.couple(view, list);

            expect(coupleModelStub).to.be.notCalled();
            expect(coupleListStub).to.be.calledOnce();
            expect(coupleViewStub).to.be.calledOnce();

            coupleModelStub.restore();
            coupleListStub.restore();
            coupleViewStub.restore();
       });
    });

    describe('coupleModel', function() {
        it('Should couple a model onto a view', function() {
            // XQCore.logLevel = 5;
            var presenter = new XQCore.Presenter('test');
            var model = new XQCore.Model('test');
            var view = new XQCore.View('test');

            presenter.coupleModel(view, model);

            expect(model.__coupled).to.be.an('object');
            expect(view.__coupled).to.be(undefined);

            expect(model.__coupled.obj).to.equal(view);
            expect(model.__coupled.events).to.be.an('array');
            expect(model.__coupled.uncouple).to.be.a('function');
        });

        it('Should uncouple a model from a view', function() {
            // XQCore.logLevel = 5;
            var presenter = new XQCore.Presenter('test');
            var model = new XQCore.Model('test');
            var view = new XQCore.View('test');

            presenter.coupleModel(view, model);

            expect(model.__coupled).to.be.an('object');
            expect(view.__coupled).to.be(undefined);
            expect(model.__events).to.have.property('data.replace');

            model.__coupled.uncouple();
            expect(model.__coupled).to.be(undefined);
            expect(view.__coupled).to.be(undefined);
            expect(model.__events).to.eql({});
        });
    });

    describe('coupleList', function() {
        it('Should couple a list onto a view', function() {
            // XQCore.logLevel = 5;
            var presenter = new XQCore.Presenter('test');
            var list = new XQCore.List('test');
            var view = new XQCore.View('test');

            presenter.coupleList(view, list);

            expect(list.__coupled).to.be.an('object');
            expect(view.__coupled).to.be(undefined);

            expect(list.__coupled.obj).to.equal(view);
            expect(list.__coupled.events).to.be.an('array');
            expect(list.__coupled.uncouple).to.be.a('function');
        });

        it('Should uncouple a list from a view', function() {
            // XQCore.logLevel = 5;
            var presenter = new XQCore.Presenter('test');
            var list = new XQCore.List('test');
            var view = new XQCore.View('test');

            presenter.coupleList(view, list);

            expect(list.__coupled).to.be.an('object');
            expect(view.__coupled).to.be(undefined);
            expect(list.__events).to.have.property('item.push');

            list.__coupled.uncouple();
            expect(list.__coupled).to.be(undefined);
            expect(view.__coupled).to.be(undefined);
            expect(list.__events).to.eql({});
        });
    });

    describe('coupleView', function() {
        it('Should couple a view onto a model', function() {
            // XQCore.logLevel = 5;
            var presenter = new XQCore.Presenter('test');
            var model = new XQCore.Model('test');
            var view = new XQCore.View('test');

            presenter.coupleView(view, model);

            expect(model.__coupled).to.be(undefined);
            expect(view.__coupled).to.be.an('object');

            expect(view.__coupled.obj).to.equal(model);
            expect(view.__coupled.events).to.be.an('array');
            expect(view.__coupled.uncouple).to.be.a('function');
        });

        it('Should couple a view onto a list', function() {
            // XQCore.logLevel = 5;
            var presenter = new XQCore.Presenter('test');
            var list = new XQCore.List('test');
            var view = new XQCore.View('test');

            presenter.coupleView(view, list);

            expect(list.__coupled).to.be(undefined);
            expect(view.__coupled).to.be.an('object');

            expect(view.__coupled.obj).to.equal(list);
            expect(view.__coupled.events).to.be.an('array');
            expect(view.__coupled.uncouple).to.be.a('function');
        });

        it('Should uncouple a view from a model', function() {
            // XQCore.logLevel = 5;
            var presenter = new XQCore.Presenter('test');
            var model = new XQCore.Model('test');
            var view = new XQCore.View('test');

            presenter.coupleView(view, model);

            expect(view.__coupled).to.be.an('object');
            expect(model.__coupled).to.be(undefined);
            expect(view.__events).to.have.property('form.submit');

            view.__coupled.uncouple();
            expect(view.__coupled).to.be(undefined);
            expect(model.__coupled).to.be(undefined);
            expect(view.__events).to.eql({});
        });

        it('Should uncouple a view from a list', function() {
            // XQCore.logLevel = 5;
            var presenter = new XQCore.Presenter('test');
            var list = new XQCore.List('test');
            var view = new XQCore.View('test');

            presenter.coupleView(view, list);

            expect(view.__coupled).to.be.an('object');
            expect(list.__coupled).to.be(undefined);
            expect(view.__events).to.have.property('form.submit');

            view.__coupled.uncouple();
            expect(view.__coupled).to.be(undefined);
            expect(list.__coupled).to.be(undefined);
            expect(view.__events).to.eql({});
        });
    });

    describe('initView', function() {
        var getTemplateStub;

        beforeEach(function() {
            getTemplateStub = sinon.stub(XQCore.Tmpl, 'getTemplate');
            getTemplateStub.returns('<div></div>');
        });

        afterEach(function() {
            getTemplateStub.restore();
        });

        it('Should initialize a view', function() {
            var presenter = new XQCore.Presenter('Test', function(self) {
                var view = self.initView('TestI');
                expect(view).to.be.a(XQCore.View);
            });

            expect(presenter.__views.TestI).to.be.ok();
        });
    });

    describe('route', function() {
        afterEach(function() {

        });
        it('Should register a routing listener', function() {
            var indexStub = sinon.stub();
            var addStub = sinon.stub();

            var presenter = new XQCore.Presenter('Test', function(self) {
                self.route('index', indexStub);
                self.route('add', addStub);

                expect(self.router.routeMap).to.eql({
                    'index': indexStub,
                    'add': addStub
                });
            });

            presenter.router.routes = [];
            presenter.router.routeMap = {};
        });

        it('Should register an array of routes with the same listener', function() {
            var indexStub = sinon.stub();
            var addStub = sinon.stub();

            var presenter = new XQCore.Presenter('Test', function(self) {
                self.route('index', indexStub);
                self.route(['add', 'new'], addStub);

                expect(self.router.routeMap).to.eql({
                    'index': indexStub,
                    'add': addStub,
                    'new': addStub
                });
            });

            presenter.router.routes = [];
            presenter.router.routeMap = {};
        });
    });
});
