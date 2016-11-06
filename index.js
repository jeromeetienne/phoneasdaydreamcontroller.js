

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
        res.sendfile('./phone.html');
});

io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
                console.log('user disconnected');
        });
        socket.on('broadcast', function(msg){
                console.log('broadcast', msg)
                io.emit('broadcast', msg);
        });
});


http.listen(3000, function(){
        console.log('listening on *:3000');
});
