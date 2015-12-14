// lirc_web - v0.0.8
// Alex Bain <alex@alexba.in>


// Default port is 3000
var config = require('config');
var port = config.get('web.port');

require('_/app').listen(port);
console.log("Open Source Universal Remote UI + API has started on port %s.", port);
