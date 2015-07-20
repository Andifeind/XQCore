describe('XQCore Presenter', function() {
    'use strict';

    describe('initialize', function() {
        it('Should initialize a presenter', function() {
            var presenter,
                initFunc = sinon.stub();

            presenter = new XQCore.Presenter('Test I', initFunc);

            expect(presenter).to.be.a(XQCore.Presenter);
            expect(presenter.name).to.eql('Test I');
            expect(initFunc).was.calledOnce();
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
        var renderStub,
            appendStub,
            prependStub,
            insertStub,
            removeStub,
            presenter,
            model,
            view;

        beforeEach(function() {
            presenter = new XQCore.Presenter();
            model = new XQCore.Model();
            view = new XQCore.View();
            
            renderStub = sinon.stub(view, 'render');
            appendStub = sinon.stub(view, 'append');
            prependStub = sinon.stub(view, 'prepend');
            insertStub = sinon.stub(view, 'insert');
            removeStub = sinon.stub(view, 'remove');
                
            presenter.init();
        });

        afterEach(function() {
            renderStub.restore();
            appendStub.restore();
            prependStub.restore();
            insertStub.restore();
            removeStub.restore();
        });
        
        it('Should couple a model with a view', function() {
            presenter.couple(view, model);

            model.set({
                data: 'changed'
            });

            expect(renderStub).was.called();
            expect(renderStub).was.calledWith({
                data: 'changed'
            });
        });
        
        it('Should render view with model data on an initial call', function() {
            model.properties = {
                'data': 'initial'
            };

            presenter.couple(view, model);

            expect(renderStub).was.calledOnce();
            expect(renderStub).was.calledWith({
                data: 'initial'
            });
        });

        it('Should couple a model with a view in scope way', function() {
            presenter = new XQCore.Presenter('Test', function(self) {
                self.couple(view, model);
            }).init();

            model.set({
                data: 'changed'
            });

            expect(renderStub).was.calledTwice();
            expect(renderStub).was.calledWith({
                data: 'changed'
            });
        });

        it.skip('Should trigger an append event', function() {
            presenter.couple(view, model);

            model.append('listing', {
                data: 'changed'
            });

            expect(renderStub).was.calledOnce();
            expect(appendStub).was.calledOnce();
            expect(appendStub).was.calledWith('listing', {
                data: 'changed'
            });
        });

        it.skip('Should trigger an prepend event', function() {
            presenter.couple(view, model);

            model.prepend('listing', {
                data: 'changed'
            });

            expect(renderStub).was.calledOnce();
            expect(prependStub).was.calledOnce();
            expect(prependStub).was.calledWith('listing', {
                data: 'changed'
            });
        });

        it.skip('Should trigger an insert event', function() {
            presenter.couple(view, model);

            model.insert('listing', 0, {
                data: 'changed'
            });

            expect(renderStub).was.calledOnce();
            expect(insertStub).was.calledOnce();
            expect(insertStub).was.calledWith('listing', 0, {
                data: 'changed'
            });
        });

        it.skip('Should trigger an remove event', function() {
            presenter.couple(view, model);

            model.set({ listing: [ { name: 'AAA' }]}, { silent: true });
            model.remove('listing', 0);

            expect(renderStub).was.calledOnce();
            expect(removeStub).was.calledOnce();
            expect(removeStub).was.calledWith('listing', 0, {
                name: 'AAA'
            });
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
        it('Should register a routing listener', function() {
            var indexStub = sinon.stub();
            var addStub = sinon.stub();
            
            var presenter = new XQCore.Presenter('Test', function(self) {
                self.route('index', indexStub);
                self.route('add', addStub);

                expect(self.__Router.routeMap).to.eql({
                    'index': indexStub,
                    'add': addStub
                });
            });

            presenter.init();
        });

        it('Should register an array of routes with the same listener', function() {
            var indexStub = sinon.stub();
            var addStub = sinon.stub();
            
            var presenter = new XQCore.Presenter('Test', function(self) {
                self.route('index', indexStub);
                self.route(['add', 'new'], addStub);

                expect(self.__Router.routeMap).to.eql({
                    'index': indexStub,
                    'add': addStub,
                    'new': addStub
                });
            });

            presenter.init();
        });
    });
});