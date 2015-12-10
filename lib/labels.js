var commandLabels = {
    "lirc_LircNamespace": {
        "KEY_POWER": "Power",
        "KEY_VOLUMEUP": "Vol+",
        "KEY_VOLUMEDOWN": "Vol-",
        "KEY_CHANNELUP": "Channel Up",
        "KEY_CHANNELDOWN": "Channel Down"
    }
};

var repeaters = {
    "lirc_SonyTV": {
        "VolumeUp": true,
        "VolumeDown": true
    }
};

var remoteLabels = {
    "lirc_LircNamespace": "LIRC namespace"
}

function getCommandLabel(remote, command) {
    return commandLabels && commandLabels[remote] && commandLabels[remote][command] ? commandLabels[remote][command] : command;
}

function getRemoteLabel(remote) {
    return remoteLabels && remoteLabels[remote] ? remoteLabels[remote] : remote;
}

module.exports = {
    command: getCommandLabel,
    remote: getRemoteLabel,
    repeaters: repeaters
};