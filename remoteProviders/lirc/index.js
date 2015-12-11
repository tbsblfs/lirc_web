var lirc_node;

// lirc_web configuration
var exports = module.exports = {};

// Based on node environment, initialize connection to lirc_node or use test data
if (process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'development') {
    var remotes = require(__dirname + '/test/fixtures/config.json').remotes;

    function logWithPrefix(prefix) {
        return function (remote, key, cb) {
            console.log(prefix + ": " + remote + " " + key);
            cb();
        };
    }
    lirc_node = {
        init: function (cb) {cb();},
        remotes: remotes,
        irsend: {
            send_once: logWithPrefix("SEND_ONCE"),
            send_start: logWithPrefix("SEND_START"),
            send_stop: logWithPrefix("SEND_STOP")
        }
    };
} else {
    lirc_node = require('lirc_node');
}

exports.init = function (cb) {
    lirc_node.init(function () {
        cb({
            remotes: lirc_node.remotes,
            sendStart: function (remote, key, cb) {
                lirc_node.irsend.send_start(remote, key, cb);
            },
            sendStop: function (remote, key, cb) {
                lirc_node.irsend.send_stop(remote, key, cb);
            },
            sendOnce: function (remote, key, cb) {
                lirc_node.irsend.send_once(remote, key, cb);
            }
        });
    });
}