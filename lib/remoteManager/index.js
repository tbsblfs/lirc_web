var requireAll = require('require-all'),
    _ = require('lodash'),
    fs = require('fs'),
    path = require('path');

var exports = module.exports = {};

var normalizedPath = path.join(__dirname, "../../remoteProviders");

var controllers = {};
fs.readdirSync(normalizedPath).forEach(function (file) {
    try {
        controllers[file] = require("../../remoteProviders/" + file);
        console.log("registered remote provider '%s'", file);
    } catch (e) {

    }
});


var remotes = {};
var remoteSenders = {}; 
function init() {
    remotes = {};
    remoteSenders = {};
    _(controllers).forEach(function (provider, providerName) {
        try {
            var providerInit = provider.init();
            _(providerInit.remotes).forEach(function (remote, remoteName) {
                remotes[providerName + "_" + remoteName] = remote;
                remoteSenders[providerName + "_" + remoteName] = {
                    sendOnce: providerInit.sendOnce,
                    sendStart: providerInit.sendStart,
                    sendStop: providerInit.sendStop
                };
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

exports.sendOnce = function (remote, key, cb) {
    if(remoteSenders[remote])
        remoteSenders[remote].sendOnce(remote.split("_", 2)[1], key, cb);
    else {
        console.log("unknown remote: " + remote);
    }
}

exports.sendStart = function (remote, key, cb) {
    if(remoteSenders[remote])
        remoteSenders[remote].sendStart(remote.split("_", 2)[1], key, cb);
}

exports.sendStop = function (remote, key, cb) {
   if(remoteSenders[remote])
        remoteSenders[remote].sendStop(remote.split("_", 2)[1], key, cb);
}