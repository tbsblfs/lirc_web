var lirc_node = require('lirc_node');

// lirc_web configuration
var exports = module.exports = {};

exports.init = function (config, cb) {
    lirc_node.init(function () {
        cb(null, {
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