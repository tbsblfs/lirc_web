var wol = require('wake_on_lan'),
    _ = require('lodash');

exports.init = function (config, cb) {
    if(!config.devices) {
        throw new Error("No devices defined.")
    }

    var remotes = {};
    var remoteFunctions = {};
    _.forEach(config.devices, function (obj, remote) {
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