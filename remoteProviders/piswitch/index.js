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
    _.forEach(switches, function (obj, key) {
        remotes[key] = _.union(_.keys(obj).map(function (x) {
            return x + " On"
        }), _.keys(obj).map(function (x) {
            return x + " Off"
        }));
    });

    function logWithPrefix(prefix) {
        return function (remote, key, cb) {
            console.log(prefix + ": " + remote + " " + key);
            cb();
        };
    }

    return {
        remotes: remotes,
        sendOnce: logWithPrefix("SEND_ONCE"),
        sendStart: logWithPrefix("SEND_START"),
        sendStop: logWithPrefix("SEND_STOP")
    }
}