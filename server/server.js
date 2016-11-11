
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//////////////////////////////////////////////////////////////////////////////
//                handle socket.io
//////////////////////////////////////////////////////////////////////////////
io.on('connection', function(socket){
        console.log('a user connected');
        // TODO here if the connection is coming from a phone, warn the headset by emiting a signal
        socket.on('disconnect', function(){
                // TODO here if the connection is coming from a phone, warn the headset by emiting a signal
                console.log('user disconnected');
        });
        socket.on('broadcast', function(msg){
                console.log('broadcast', msg)
                io.emit('broadcast', msg);
        });
});


//////////////////////////////////////////////////////////////////////////////
//                start listening 
//////////////////////////////////////////////////////////////////////////////

http.listen(4000, function(){
        console.log('listening on *:4000');
});
