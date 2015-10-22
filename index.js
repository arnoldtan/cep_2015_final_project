"use strict";

var app = require('./app.js');
var models = require("./models");
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var redis = require('socket.io-redis');
io.adapter(redis({ host: '127.0.0.1', port: 6379 }));

require('./io.js')(io);

app.set('port', process.env.PORT || 8080);
//http.listen(process.env.PORT || 3000, process.env.IP);

models.sequelize.sync({ force: true }).then(function () {
  server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });
});