var
    _ = require('lodash');

// lirc_web configuration
var config = module.exports = {};

var switches = {
    "Light": {
        "Light1": {
            "dip": "101101000"
        },
        "Light2": {
            "dip": "101100100"
        },
        "Light3": {
            "dip": "101100010"
        },
    }
};

config.remotes = {};
_(switches).forEach(function (obj, key) {
    config.remotes[key] = _.union(_.keys(obj).map(function (x) {
        return x + " On"
    }), _.keys(obj).map(function (x) {
        return x + " Off"
    }));
});

config.send_once = function (a, b, c) {
    console.log("SEND_ONCE: " + a + " " + b);
};
config.send_start = function (a, b, c) {
    console.log("SEND_START: " + a + " " + b);
};
config.send_stop = function (a, b, c) {
    console.log("SEND_STOP: " + a + " " + b);
};