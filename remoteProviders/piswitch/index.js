var
    _ = require('lodash');

// lirc_web configuration
var exports = module.exports = {};

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


exports.init = function () {

    var remotes = {};
    _(switches).forEach(function (obj, key) {
        remotes[key] = _.union(_.keys(obj).map(function (x) {
            return x + " On"
        }), _.keys(obj).map(function (x) {
            return x + " Off"
        }));
    });

    return {
        remotes: remotes,
        sendOnce: function (a, b, cb) {
            console.log("SEND_ONCE: " + a + " " + b);
            cb();
        },
        sendStart: function (a, b, cb) {
            console.log("SEND_START: " + a + " " + b);
            cb();
        },
        sendStop: send_stop = function (a, b, cb) {
            console.log("SEND_STOP: " + a + " " + b);
            cb();
        }
    }
}