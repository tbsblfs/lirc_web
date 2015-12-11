var express = require('express'),
    consolidate = require('consolidate'),
    morgan = require('morgan'),
    compression = require('compression'),
    serveStatic = require('serve-static'),
    swig = require('swig'),
    labels = require('_/labels'),
    remoteManager = require('_/remoteManager'),
    macros = require('_/macros');


// Precompile templates


// Create app
var app = module.exports = express();

// App configuration
app.engine('.html', consolidate.swig);
app.set('views', __dirname + '/templates');
app.set('view engine', 'html');

app.use(morgan('combined'));
app.use(compression());
app.use(serveStatic(__dirname + '/static'));

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

// Web UI
app.get('/', function (req, res) {
    res.render('index', {
        remotes: remoteManager.getRemotes(),
        macros: macros.getMacros(),
        repeaters: labels.repeaters,
        labelForRemote: labels.remote,
        labelForCommand: labels.command
    });
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
    var keys = remoteManager.getKeys(req.params.remote);
    if (keys) {
        res.json(keys);
    } else {
        res.sendStatus(404);
    }
});

// Send :remote/:command one time
app.post('/remotes/:remote/:command', nocache, function (req, res) {
    remoteManager.sendOnce(req.params.remote, req.params.command, function () {});
    res.sendStatus(200);
});

// Start sending :remote/:command repeatedly
app.post('/remotes/:remote/:command/send_start', nocache, function (req, res) {
    remoteManager.sendStart(req.params.remote, req.params.command, function () {});
    res.sendStatus(200);
});

// Stop sending :remote/:command repeatedly
app.post('/remotes/:remote/:command/send_stop', nocache, function (req, res) {
    remoteManager.sendStop(req.params.remote, req.params.command, function () {});
    res.sendStatus(200);
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
        res.sendStatus(404);
    }
});

// Execute a macro (a collection of commands to one or more remotes)
app.post('/macros/:macro', nocache, function (req, res) {
    // If the macro exists, execute each command in the macro with 100msec
    // delay between each command.
    macros.executeMacro(req.params.macro);
    res.sendStatus(200);
});