exports.init = function (config, cb) {
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
        cb(new Error("only in test/dev mode"));
        return;
    }

    var remotes = require(__dirname + '/../../test/fixtures/remotes.json').remotes;

    function logWithPrefix(prefix) {
        return function (remote, key, cb) {
            console.log(prefix + ": " + remote + " " + key);
            cb();
        };
    }

    cb(null, {
        remotes: remotes,
        sendOnce: logWithPrefix("SEND_ONCE"),
        sendStart: logWithPrefix("SEND_START"),
        sendStop: logWithPrefix("SEND_STOP")
    });
}