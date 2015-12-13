var wol = require('wake_on_lan'),
    _ = require('lodash');

var requests = {
    "Test": {
        "PC": {
            "mac": "12-34-56-78-9A-BC"
        }
    }
};

exports.init = function (cb) {

    var remotes = {};
    var remoteFunctions = {};
    _.forEach(requests, function (obj, remote) {
        var names = remotes[remote] = [];
        var functions = remoteFunctions[remote] = {};
        _.keys(obj).forEach(function (key) {
            names.push(key);
            functions[key] = obj[key];
        });
    });

    function logWithPrefix(prefix) {
        return function (remote, key, cb) {
            console.log(prefix + ": " + remote + " " + key);
            cb();
        };
    }

    cb({
        remotes: remotes,
        sendOnce: function (remote, key, cb) {
            wol.wake(remoteFunctions[remote][key].mac, cb);
        },
        sendStart: logWithPrefix("SEND_START"),
        sendStop: logWithPrefix("SEND_STOP")
    });
}