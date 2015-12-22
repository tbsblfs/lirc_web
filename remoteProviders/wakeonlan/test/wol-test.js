var assert = require('assert'),
    sinon = require('sinon'),
    mockery = require('mockery');

var config = {
    "devices": {
        "Test": {
            "PC": {
                "mac": "12-34-56-78-9A-BC"
            }
        }
    }
};

var remotes = {
    "Test": ["PC"]
};

var sandbox = sinon.sandbox.create(),
    stubbedWol = {
        wake: sandbox.stub().callsArg(1)
    };


describe('wolRemoteProvider', function () {
    var wol;

    before(function (done) {
        mockery.enable({
            useCleanCache: true
        });
        mockery.registerMock('wake_on_lan', stubbedWol);
        mockery.registerAllowable('../', true);
        wol = require('../');
        done();
    });

    var wolProvider;
    beforeEach(function (done) {
        wol.init(config, function (err, x) {
            wolProvider = x;
            done();
        });
    });

    describe('provider', function () {
        it('should return the remotes', function (done) {
            wolProvider.should.have.property("remotes");
            wolProvider.remotes.should.deepEqual(remotes);
            done();
        });

        it('should have sendOnce property', function () {
            wolProvider.should.have.property("sendOnce");
        })
    });
    describe('sendOnce', function () {
        it('should send request for valid key', function (done) {
            wolProvider.sendOnce("Test", "PC", function () {
                stubbedWol.wake.calledOnce.should.be.equal(true);
                stubbedWol.wake.calledWith(config.devices.Test.PC.mac).should.be.equal(true);
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