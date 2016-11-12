#!/usr/bin/env node

var Server = require('socket.io');
var io = new Server(4000);
console.log('listen on *:4000')

//////////////////////////////////////////////////////////////////////////////
//                handle socket.io
//////////////////////////////////////////////////////////////////////////////
io.on('connection', function(socket){
        var parsedUrl = require('url').parse(socket.request.url)
        var query = require('querystring').parse(parsedUrl.query)
        var parameters = {
                origin : query.origin,
                hand : query.hand
        }
        console.dir(parameters)

        console.log('a user connected');
        // console.log('request', socket.request)
        // TODO here if the connection is coming from a phone, warn the headset by emiting a signal
        socket.on('disconnect', function(){
                // TODO here if the connection is coming from a phone, warn the headset by emiting a signal
                console.log('user disconnected');
        });

        socket.on('broadcast', function(msg){
                io.emit('broadcast', msg);
        });
});
