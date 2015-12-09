var lirc_node = require('lirc_node');

// lirc_web configuration
var config = module.exports = {};

// Based on node environment, initialize connection to lirc_node or use test data
if (process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'development') {
    config = module.exports = require(__dirname + '/test/fixtures/config.json');
    config.send_once = function (a, b, c) {
        console.log("SEND_ONCE: " + a + " " + b);
    };
    config.send_start = function (a, b, c) {
        console.log("SEND_START: " + a + " " + b);
    };
    config.send_stop = function (a, b, c) {
        console.log("SEND_STOP: " + a + " " + b);
    };
} else {
    _init();
}

function _init() {
    lirc_node.init();

    // Config file is optional
    try {
        config = module.exports = require(__dirname + '/config.json');

    } catch (e) {
        console.log("DEBUG:", e);
        console.log("WARNING: Cannot find config.json!");
    }
    config.remotes = lirc_node.remotes;
    config.send_start = lirc_node.irsend.send_start;
    config.send_stop = lirc_node.irsend.send_stop;
    config.send_once = lirc_node.irsend.send_once;
}