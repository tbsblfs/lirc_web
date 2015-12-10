var express = require('express'),
    consolidate = require('consolidate'),
    path = require('path'),
    swig = require('swig'),
    labels = require('_/labels'),
    remoteManager = require('_/remoteManager'),
    macros = require('_/macros');


// Precompile templates
var JST = {
    index: swig.compileFile(__dirname + '/templates/index.swig')
};

// Create app
var app = module.exports = express();

// App configuration
app.engine('.html', consolidate.swig);
app.configure(function () {
    app.use(express.logger());
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.compress());
    app.use(express.static(__dirname + '/static'));
});

// Routes
var labelFor = labels(null, null);
var repeaters = {};

// Web UI
app.get('/', function (req, res) {
    res.send(JST['index'].render({
        remotes: remoteManager.getRemotes(),
        macros: macros.getMacros(),
        repeaters: repeaters,
        labelForRemote: labelFor.remote,
        labelForCommand: labelFor.command
    }));
});

// Refresh
app.get('/refresh', function (req, res) {
    remoteManager.init();
    res.redirect('/');
});

// List all remotes in JSON format
app.get('/remotes.json', function (req, res) {
    res.json(remoteManager.getRemotes());
});

// List all commands for :remote in JSON format
app.get('/remotes/:remote.json', function (req, res) {
    if (remoteManager.getRemotes()[req.params.remote]) {
        res.json(remoteManager.getRemotes()[req.params.remote]);
    } else {
        res.send(404);
    }
});

// List all macros in JSON format
app.get('/macros.json', function (req, res) {
    res.json(macros.getMacros());
});

// List all commands for :macro in JSON format
app.get('/macros/:macro.json', function (req, res) {
    if (macros.getMacros()[req.params.macro]) {
        res.json(macros.getMacros()[req.params.macro]);
    } else {
        res.send(404);
    }
});


// Send :remote/:command one time
app.post('/remotes/:remote/:command', function (req, res) {
    remoteManager.sendOnce(req.params.remote, req.params.command, function () {});
    res.setHeader('Cache-Control', 'no-cache');
    res.send(200);
});

// Start sending :remote/:command repeatedly
app.post('/remotes/:remote/:command/send_start', function (req, res) {
    remoteManager.senStart(req.params.remote, req.params.command, function () {});
    res.setHeader('Cache-Control', 'no-cache');
    res.send(200);
});

// Stop sending :remote/:command repeatedly
app.post('/remotes/:remote/:command/send_stop', function (req, res) {
    remoteManager.sendStop(req.params.remote, req.params.command, function () {});
    res.setHeader('Cache-Control', 'no-cache');
    res.send(200);
});

// Execute a macro (a collection of commands to one or more remotes)
app.post('/macros/:macro', function (req, res) {

    // If the macro exists, execute each command in the macro with 100msec
    // delay between each command.
    macros.executeMacro(req.params.macro);

    res.setHeader('Cache-Control', 'no-cache');
    res.send(200);
});