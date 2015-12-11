var piswitch,
    _ = require('lodash');

if (process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'development') {
    piswitch = {
        setup: function () {
            console.log("piswitch setup");
        },
        send: function (code, type, off) {
            console.log("piswitch code:" + code + " type:" + type + " off:" + off);
        }
    }
} else {
    piswitch = require('piswitch');
}

// lirc_web configuration
var exports = module.exports = {};

var switches = {
    "Light": {
        "Light1": {
            "dip": "1001010000"
        },
        "Light2": {
            "dip": "1001001000"
        },
        "Light3": {
            "dip": "1001000100"
        },
    }
};


exports.init = function () {

    piswitch.setup({pin: 22});

    var remotes = {};
    var remoteFunctions = {};
    _.forEach(switches, function (obj, remote) {
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

    return {
        remotes: remotes,
        sendOnce: function (remote, key, cb) {
            var d = remoteFunctions[remote][key];
            piswitch.send(d.dip, 'dip', d.off);
            cb();
        },
        sendStart: logWithPrefix("SEND_START"),
        sendStop: logWithPrefix("SEND_STOP")
    }
}