var request = require('request'),
    _ = require('lodash');


exports.init = function (config, cb) {
    if (!config.requests) {
        cb(new Error("http provider: No requests defined"));
        return;
    }

    var remotes = {};
    var remoteFunctions = {};
    _.forEach(config.requests, function (obj, remote) {
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
            request(remoteFunctions[remote][key], cb);
        }
    });
}