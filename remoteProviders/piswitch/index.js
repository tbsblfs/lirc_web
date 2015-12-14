var piswitch = require('piswitch'),
    _ = require('lodash');

// lirc_web configuration
var exports = module.exports = {};

exports.init = function (config, cb) {
    if (!config.switches) {
        throw new Error("No switches defined.")
    }

    piswitch.setup({
        pin: config.pin || 22
    });

    var remotes = {};
    var remoteFunctions = {};
    _.forEach(config.switches, function (obj, remote) {
        var names = remotes[remote] = [];
        var functions = remoteFunctions[remote] = {};
        _.keys(obj).forEach(function (key) {
            names.push(key + " On");
            functions[key + " On"] = {
                dip: obj[key].dip,
                off: false
            }
            names.push(key + " Off");
            functions[key + " Off"] = {
                dip: obj[key].dip,
                off: true
            }
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
            var d = remoteFunctions[remote][key];
            piswitch.send(d.dip, 'dip', d.off);
            cb();
        },
        sendStart: logWithPrefix("SEND_START"),
        sendStop: logWithPrefix("SEND_STOP")
    });
}