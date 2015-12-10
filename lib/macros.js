var remoteManager = require('_/remoteManager');

var macros = {
    "Play Xbox 360": [
      ["lirc_SonyTV", "Power"],
      ["lirc_SonyTV", "Xbox360"],
      ["lirc_Yamaha", "Power"],
      ["lirc_Yamaha", "Xbox360"],
      ["lirc_Xbox360", "Power"]
    ],
    "Listen to Music": [
      ["lirc_Yamaha", "Power"],
      ["lirc_Yamaha", "AirPlay"]
    ]
};

module.exports = {
    getMacros: function () {
        return macros;
    },
    executeMacro: function (macro) {
        if (macros[macro]) {
            var i = 0;

            var nextCommand = function () {
                var command = macros[macro][i];

                if (!command) {
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
}