var config = require('config');

var commandLabels = config.get('commandLabels'),
    repeaters = config.get('repeaters'),
    remoteLabels = config.get('remoteLabels');

function getCommandLabel(remote, command) {
    return commandLabels && commandLabels[remote] && commandLabels[remote][command] ? commandLabels[remote][command] : command;
}

function getRemoteLabel(remote) {
    return remoteLabels && remoteLabels[remote] ? remoteLabels[remote] : remote;
}

function isRepeater(remote, command) {
    return repeaters[remote] && repeaters[remote][command];
}

module.exports = {
    command: getCommandLabel,
    remote: getRemoteLabel,
    repeaters: isRepeater
};