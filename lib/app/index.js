var express = require('express'),
    consolidate = require('consolidate'),
    path = require('path'),
    swig = require('swig'),
    labels = require('../labels'),
    config = require('../lirc');

// Precompile templates
var JST = {
    index: swig.compileFile(__dirname + '/templates/index.swig')
};

// Create app
var app = module.exports = express();

// App configuration
app.engine('.html', consolidate.swig);
app.configure(function() {
    app.use(express.logger());
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.compress());
    app.use(express.static(__dirname + '/static'));
});

// Routes
var labelFor = labels(config.remoteLabels, config.commandLabels)

// Web UI
app.get('/', function(req, res) {
    res.send(JST['index'].render({
        remotes: config.remotes,
        macros: config.macros,
        repeaters: config.repeaters,
        labelForRemote: labelFor.remote,
        labelForCommand: labelFor.command
    }));
});

// Refresh
app.get('/refresh', function(req, res) {
    _init();
    res.redirect('/');
});

// List all remotes in JSON format
app.get('/remotes.json', function(req, res) {
    res.json(config.remotes);
});

// List all commands for :remote in JSON format
app.get('/remotes/:remote.json', function(req, res) {
    if (config.remotes[req.params.remote]) {
        res.json(config.remotes[req.params.remote]);
    } else {
        res.send(404);
    }
});

// List all macros in JSON format
app.get('/macros.json', function(req, res) {
    res.json(config.macros);
});

// List all commands for :macro in JSON format
app.get('/macros/:macro.json', function(req, res) {
    if (config.macros && config.macros[req.params.macro]) {
        res.json(config.macros[req.params.macro]);
    } else {
        res.send(404);
    }
});


// Send :remote/:command one time
app.post('/remotes/:remote/:command', function(req, res) {
    config.send_once(req.params.remote, req.params.command, function() {});
    res.setHeader('Cache-Control', 'no-cache');
    res.send(200);
});

// Start sending :remote/:command repeatedly
app.post('/remotes/:remote/:command/send_start', function(req, res) {
    config.send_start(req.params.remote, req.params.command, function() {});
    res.setHeader('Cache-Control', 'no-cache');
    res.send(200);
});

// Stop sending :remote/:command repeatedly
app.post('/remotes/:remote/:command/send_stop', function(req, res) {
    config.send_stop(req.params.remote, req.params.command, function() {});
    res.setHeader('Cache-Control', 'no-cache');
    res.send(200);
});

// Execute a macro (a collection of commands to one or more remotes)
app.post('/macros/:macro', function(req, res) {

    // If the macro exists, execute each command in the macro with 100msec
    // delay between each command.
    if (config.macros && config.macros[req.params.macro]) {
        var i = 0;

        var nextCommand = function() {
            var command = config.macros[req.params.macro][i];

    	    if (!command) { return true; }

            // increment
            i = i + 1;

            if (command[0] == "delay") {
                setTimeout(nextCommand, command[1]);
            } else {
                // By default, wait 100msec before calling next command
                config.send_once(command[0], command[1], function() { setTimeout(nextCommand, 100); });
            }
        };

        // kick off macro w/ first command
        nextCommand();
    }

    res.setHeader('Cache-Control', 'no-cache');
    res.send(200);
});
