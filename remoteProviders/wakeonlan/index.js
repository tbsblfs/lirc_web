var wol = require('wake_on_lan'),
    _ = require('lodash');

exports.init = function (config, cb) {
    if (!config.devices) {
        cb(new Error("No devices defined."));
        return;
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

    cb(null, {
        remotes: remotes,
        sendOnce: function (remote, key, cb) {
            wol.wake(remoteFunctions[remote][key].mac, cb);
        }
    });
}