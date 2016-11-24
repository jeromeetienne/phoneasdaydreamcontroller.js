#!/usr/bin/env node

var Server = require('socket.io');
var io = new Server(4000);
console.log('listen on *:4000')


var phones = {}


//////////////////////////////////////////////////////////////////////////////
//                onConnection socket.io
//////////////////////////////////////////////////////////////////////////////
io.on('connection', function(socket){
        var parsedUrl = require('url').parse(socket.request.url)
        var query = require('querystring').parse(parsedUrl.query)
        var parameters = {
                hand : query.hand,
                gamepadIndex : parseInt(query.gamepadIndex,10),
        }

        if( query.origin === 'app' ){
                onConnectionAppSocket(socket, parameters)
        }else if( query.origin === 'phone' ){
                onConnectionPhoneSocket(socket, parameters)
        }else{
                console.assert(false)
        }
        
});


function onConnectionAppSocket(socket, parameters){
        console.log('a app connected');

        // if( io.sockets.adapter.rooms['app'] && io.sockets.adapter.rooms['app'].length > 0 ){
        //         console.warn('received a new appSocket but already had a appSocket')
        //         socket.client.close()
        //         return
        // }

        socket.join('app')

        io.to('phone').emit('appconnected');
        
        Object.keys(phones).forEach(function(socketId){
                var phone = phones[socketId]
                socket.emit('phoneconnected', phone.parameters);
        })
                
        // console.log('request', socket.request)
        socket.on('disconnect', function(){
                io.to('phone').emit('appdisconnected');

                console.log('app disconnected');
        });
}

function onConnectionPhoneSocket(socket, parameters){
        console.log('a phone connected with', parameters);

        socket.join('phone')
        var phone = phones[socket.id] = {
                parameters : parameters,
                socket : socket,
        }

        io.to('app').emit('phoneconnected', phone.parameters);

        if( io.sockets.adapter.rooms['app'] && io.sockets.adapter.rooms['app'].length > 0 ){
                socket.emit('appconnected');                
        }

        // console.log('request', socket.request)
        socket.on('disconnect', function(){
                console.log('phone disconnected', phone.parameters);
                io.to('app').emit('phonedisconnected', phone.parameters);
                delete phones[socket.id] 
        });

        socket.on('forwardToApp', function(msg){
                io.to('app').emit('broadcast', msg);
        });        
}
