describe('XQCore Logger', function() {
    'use strict';

    describe('instance', function() {
        it('Should be a function', function() {
            expect(XQCore.Logger).to.be.a('function');
        });

        it('Should create a new XQCore.Logger instance', function() {
            var log = new XQCore.Logger();
            expect(log).to.be.a(XQCore.Logger);
        });
    });

    describe('log', function() {
        it('Should write a log message', function() {
            var log = new XQCore.Logger();
            log.logLevel = 3;
            
            var logStub = sinon.stub(console, 'log');
            log.log('Test log');
            logStub.restore();

            expect(logStub).to.be.calledOnce();
            expect(logStub).to.be.calledWith('Test log');
        });

        it('Should write a log message if logLevel is to low', function() {
            var log = new XQCore.Logger();
            log.logLevel = 2;

            var logStub = sinon.stub(console, 'log');
            log.log('Test log');
            logStub.restore();

            expect(logStub).to.be.notCalled();
        });

        it('Should write a log message, append module name', function() {
            var log = new XQCore.Logger('test');
            log.logLevel = 3;
            
            var logStub = sinon.stub(console, 'log');
            log.log('Test log');
            logStub.restore();

            expect(logStub).to.be.calledOnce();
            expect(logStub).to.be.calledWith('[test]', 'Test log');
        });

        it('Should write a log message, using all args', function() {
            var log = new XQCore.Logger('test');
            log.logLevel = 4;
            
            var logStub = sinon.stub(console, 'log');
            log.log('Test log', {test: 'Test'});
            logStub.restore();

            expect(logStub).to.be.calledOnce();
            expect(logStub).to.be.calledWith('[test]', 'Test log', {test: 'Test'});
        });
    });

    describe('info', function() {
        it('Should write a info message', function() {
            var log = new XQCore.Logger();
            log.logLevel = 3;
            
            var infoStub = sinon.stub(console, 'log');
            log.info('Test log');
            infoStub.restore();

            expect(infoStub).to.be.calledOnce();
            expect(infoStub).to.be.calledWith('Test log');
        });

        it('Should write a log message if logLevel is to low', function() {
            var log = new XQCore.Logger();
            log.logLevel = 2;

            var infoStub = sinon.stub(console, 'log');
            log.info('Test log');
            infoStub.restore();

            expect(infoStub).to.be.notCalled();
        });

        it('Should write a log message, append module name', function() {
            var log = new XQCore.Logger('test');
            log.logLevel = 3;
            
            var infoStub = sinon.stub(console, 'log');
            log.info('Test log');
            infoStub.restore();

            expect(infoStub).to.be.calledOnce();
            expect(infoStub).to.be.calledWith('[test]', 'Test log');
        });

        it('Should write a log message, using all args', function() {
            var log = new XQCore.Logger('test');
            log.logLevel = 4;
            
            var infoStub = sinon.stub(console, 'log');
            log.info('Test log', {test: 'Test'});
            infoStub.restore();

            expect(infoStub).to.be.calledOnce();
            expect(infoStub).to.be.calledWith('[test]', 'Test log', {test: 'Test'});
        });
    });

    describe('warn', function() {
        it('Should write a warn message', function() {
            var log = new XQCore.Logger();
            log.logLevel = 2;
            
            var warnStub = sinon.stub(console, 'warn');
            log.warn('Test log');
            warnStub.restore();

            expect(warnStub).to.be.calledOnce();
            expect(warnStub).to.be.calledWith('Test log');
        });

        it('Should not write a log message if logLevel is to low', function() {
            var log = new XQCore.Logger();
            log.logLevel = 1;

            var warnStub = sinon.stub(console, 'warn');
            log.warn('Test log');
            warnStub.restore();

            expect(warnStub).to.be.notCalled();
        });

        it('Should write a log message, append module name', function() {
            var log = new XQCore.Logger('test');
            log.logLevel = 2;
            
            var warnStub = sinon.stub(console, 'warn');
            log.warn('Test log');
            warnStub.restore();

            expect(warnStub).to.be.calledOnce();
            expect(warnStub).to.be.calledWith('[test]', 'Test log');
        });

        it('Should write a log message, using all args', function() {
            var log = new XQCore.Logger('test');
            log.logLevel = 2;
            
            var warnStub = sinon.stub(console, 'warn');
            log.warn('Test log', {test: 'Test'});
            warnStub.restore();

            expect(warnStub).to.be.calledOnce();
            expect(warnStub).to.be.calledWith('[test]', 'Test log', {test: 'Test'});
        });
    });

    describe('error', function() {
        it('Should write a error message', function() {
            var log = new XQCore.Logger();
            log.logLevel = 1;
            
            var errorStub = sinon.stub(console, 'error');
            log.error('Test log');
            errorStub.restore();

            expect(errorStub).to.be.calledOnce();
            expect(errorStub).to.be.calledWith('Test log');
        });

        it('Should not write a log message if logLevel is to low', function() {
            var log = new XQCore.Logger();
            log.logLevel = 0;

            var errorStub = sinon.stub(console, 'error');
            log.error('Test log');
            errorStub.restore();

            expect(errorStub).to.be.notCalled();
        });

        it('Should write a log message, append module name', function() {
            var log = new XQCore.Logger('test');
            log.logLevel = 1;
            
            var errorStub = sinon.stub(console, 'error');
            log.error('Test log');
            errorStub.restore();

            expect(errorStub).to.be.calledOnce();
            expect(errorStub).to.be.calledWith('[test]', 'Test log');
        });

        it('Should write a log message, using all args', function() {
            var log = new XQCore.Logger('test');
            log.logLevel = 1;
            
            var errorStub = sinon.stub(console, 'error');
            log.error('Test log', {test: 'Test'});
            errorStub.restore();

            expect(errorStub).to.be.calledOnce();
            expect(errorStub).to.be.calledWith('[test]', 'Test log', {test: 'Test'});
        });
    });

    describe('debug', function() {
        it('Should write a debug message', function() {
            var log = new XQCore.Logger();
            log.logLevel = 4;
            
            var debugStub = sinon.stub(console, 'debug');
            log.debug('Test log');
            debugStub.restore();

            expect(debugStub).to.be.calledOnce();
            expect(debugStub).to.be.calledWith('Test log');
        });

        it('Should not write a log message if logLevel is to low', function() {
            var log = new XQCore.Logger();
            log.logLevel = 3;

            var debugStub = sinon.stub(console, 'debug');
            log.debug('Test log');
            debugStub.restore();

            expect(debugStub).to.be.notCalled();
        });

        it('Should write a log message, append module name', function() {
            var log = new XQCore.Logger('test');
            log.logLevel = 4;
            
            var debugStub = sinon.stub(console, 'debug');
            log.debug('Test log');
            debugStub.restore();

            expect(debugStub).to.be.calledOnce();
            expect(debugStub).to.be.calledWith('[test]', 'Test log');
        });

        it('Should write a log message, using all args', function() {
            var log = new XQCore.Logger('test');
            log.logLevel = 5;
            
            var debugStub = sinon.stub(console, 'debug');
            log.debug('Test log', {test: 'Test'});
            debugStub.restore();

            expect(debugStub).to.be.calledOnce();
            expect(debugStub).to.be.calledWith('[test]', 'Test log', {test: 'Test'});
        });
    });

    describe('timer', function() {

        var log;
        beforeEach(function() {
            log = new XQCore.Logger();
            log.debug = true;
            log.name = 'test';
        });

        afterEach(function() {

        });

        it('Should start a timer', function() {
            var timer = log.timer('test1');
            expect(timer).to.be.an('object');
            expect(timer).to.have.property('name');
            expect(timer).to.have.property('start');
            expect(timer).to.have.property('stop');
            expect(timer).to.have.property('end');
            expect(timer.end).to.be.a('function');
        });

        it('Should stop a timer and logs the resultto the console', function() {
            var timer;

            var nowStub = sinon.stub(Date, 'now');
            nowStub.onFirstCall().returns(100);
            nowStub.onSecondCall().returns(105);
            

            var logStub = sinon.stub(log, 'log');
            timer = log.timer('test2');
            timer.end();
            
            expect(logStub).to.be.calledTwice();
            expect(logStub).to.be.calledWith('Timer test2 finished after 5ms');
            
            nowStub.restore();
            logStub.restore();
        });
    });

    describe('getHumanTime', function() {
        it('Should convert a number into a readable time string', function() {
            var log = new XQCore.Logger();
            expect(log.getHumanTime(399)).to.eql('399ms');
            expect(log.getHumanTime(5555)).to.eql('5.6sec');
            expect(log.getHumanTime(66666)).to.eql('1min 7sec');
        });
    });
});