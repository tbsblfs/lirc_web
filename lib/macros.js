var remoteManager = require('_/remoteManager'),
    config = require('config');

var macros = config.get('macros');

module.exports = {
    getMacros: function () {
        return macros;
    },
    getMacro: function (macro) {
        return macros[macro];
    },
    executeMacro: function (macro, cb) {
        if (!macros[macro]) {
            var err = new Error("unknown macro");
            err.status = 404;
            return cb(err);
        }

        var i = 0;

        var nextCommand = function () {
            var command = macros[macro][i];

            if (!command) {
                cb();
                return true;
            }

            // increment
            i = i + 1;

            if (command[0] == "delay") {
                setTimeout(nextCommand, command[1]);
            } else {
                // By default, wait 100msec before calling next command
                remoteManager.sendOnce(command[0], command[1], function () {
                    setTimeout(nextCommand, 100);
                });
            }
        };

        // kick off macro w/ first command
        nextCommand();
    }
}