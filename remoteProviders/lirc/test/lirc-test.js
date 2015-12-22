var assert = require('assert'),
    sinon = require('sinon'),
    mockery = require('mockery');

var remotes = require(__dirname + '/../../../test/fixtures/remotes.json').remotes;

var sandbox = sinon.sandbox.create(),
    stubbedLircNode = {
        init: sandbox.stub().callsArg(0),
        remotes: remotes,
        irsend: {
            send_once: sandbox.stub().callsArg(2),
            send_start: sandbox.stub().callsArg(2),
            send_stop: sandbox.stub().callsArg(2)
        }
    };


describe('lircRemoteProvider', function () {
    var lirc;

    before(function (done) {
        mockery.enable({
            useCleanCache: true
        });
        mockery.registerMock('lirc_node', stubbedLircNode);
        mockery.registerAllowable('../', true);
        lirc = require('../');
        done();
    });

    var lircProvider;
    beforeEach(function (done) {
        lirc.init(null, function (err, x) {
            lircProvider = x;
            done();
        });
    });

    describe('provider', function () {
        it('should return the remotes', function (done) {
            lircProvider.should.have.property("remotes");
            lircProvider.remotes.should.deepEqual(remotes);
            done();
        });

        it('should have sendOnce property', function () {
            lircProvider.should.have.property("sendOnce");
        })
    });
    describe('sendOnce', function () {
        it('should send request for valid key', function (done) {
            lircProvider.sendOnce("Yamaha", "Power", function () {
                stubbedLircNode.irsend.send_once.calledOnce.should.be.equal(true);
                stubbedLircNode.irsend.send_once.calledWith("Yamaha", "Power").should.be.equal(true);
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