var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    config = require('config');

var exports = module.exports = {};

var normalizedPath = path.join(__dirname, "../../remoteProviders");

var controllers = {};
fs.readdirSync(normalizedPath).filter(function (file) {
    return fs.statSync(path.join(normalizedPath, file)).isDirectory();
}).forEach(function (file) {
    try {
        controllers[file] = require(path.join(normalizedPath, file));
        console.log("registered remote provider '%s'", file);
    } catch (e) {
        console.log("failed to init remote provider: %s", file);
        console.log("DEBUG:", e);
    }
});


var remotes = {};
var remoteSenders = {};

function init() {
    remotes = {};
    remoteSenders = {};
    _.forEach(controllers, function (provider, providerName) {
        try {
            var configName = "providers." + providerName;
            var conf = config.has(configName) ? config.get(configName) : {};
            provider.init(conf, function (err, providerInit) {
                if (!providerInit.sendStart) {
                    providerInit.sendStart = providerInit.sendOnce;
                    providerInit.sendStop = function () {};
                }

                _.forEach(providerInit.remotes, function (remote, remoteName) {
                    remotes[providerName + "_" + remoteName] = remote;
                    remoteSenders[providerName + "_" + remoteName] = {
                        sendOnce: providerInit.sendOnce,
                        sendStart: providerInit.sendStart,
                        sendStop: providerInit.sendStop
                    };
                });
                console.log("initialized remote provider: %s", providerName);
            });

        } catch (e) {
            console.log("failed to init remote provider: %s", providerName);
            console.log("DEBUG:", e);
        }
    });
    return remotes;
}
exports.init = init;
init();

exports.getRemotes = function () {
    return remotes;
}

exports.getKeys = function (remote) {
    return remotes[remote];
}

function handle(option) {
    return function (remote, key, cb) {
        if (remotes[remote]) {
            if (remotes[remote].indexOf(key) !== -1) {
                remoteSenders[remote][option](remote.split("_", 2)[1], key, cb);
            } else {
                var err = new Error("unknown key " + key + " on remote " + remote);
                err.status = 404;
                cb(err);
            }
        } else {
            var err = new Error("unknown remote: " + remote);
            err.status = 404;
            cb(err);
        }
    }
}

exports.sendOnce = handle("sendOnce");

exports.sendStart = handle("sendStart");

exports.sendStop = handle("sendStop");