var assert = require('assert'),
    sinon = require('sinon'),
    mockery = require('mockery');

var sandbox = sinon.sandbox.create(),
    stubbedRequest = sandbox.stub().callsArg(1);

var configFix = {
    requests: {
        remote1: {
            test: {
                method: "POST",
                url: "http://localhost/example"
            }
        }
    }
};

describe('httpRemoteProvider', function () {
    var http;

    before(function (done) {
        mockery.enable({
            useCleanCache: true
        });
        mockery.registerAllowable('lodash');
        mockery.registerMock('request', stubbedRequest);
        mockery.registerAllowable('../', true);
        http = require('../');
        done();
    });

    var httpProvider;
    beforeEach(function (done) {
        http.init(configFix, function (err, x) {
            httpProvider = x;
            done();
        });
    });

    

    describe('provider', function () {
        it('should return error if config invalid', function (done) {
            http.init({}, function (err, x) {
                err.should.be.Object;
                done();
            });
        })

        it('should return the remotes', function (done) {
            httpProvider.should.have.property("remotes");
            httpProvider.remotes.should.deepEqual({
                remote1: ["test"]
            });
            done();
        });

        it('should have sendOnce property', function () {
            httpProvider.should.have.property("sendOnce");
        })
    });
    describe('sendOnce', function () {
        it('should send request for valid key', function (done) {
            httpProvider.sendOnce("remote1", "test", function () {
                stubbedRequest.calledOnce.should.be.equal(true);
                stubbedRequest.calledWith(configFix.requests.remote1.test).should.be.equal(true);
                done();
            });
        });
    });
    
    after(function () {
        sandbox.verifyAndRestore();
        mockery.deregisterAll();
        mockery.disable();
    });
});