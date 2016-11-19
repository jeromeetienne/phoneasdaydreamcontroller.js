# phonegamepad
use your phone as a gamepad (3dof Virtual reality gamepad).

It is quite early stage, looking forward to have that in the ray-input

based on https://developers.google.com/vr/unity/controller-basics

# Instruction
- start the websocket server ```node index.js```
- enter the url of the server on your phone, e.g. ```http://192.168.0.2:8080/phonecontroller.html```
  - you will see the gamepad page
- start a static http server, e.g. ```http-server```
- open ```http:192.168.0.2:8080/examples/webvr.html``` for an example of 3dof controller

# Get Started

To run the examples, first do install the server 

```
npm install
```

start to run the websocket server 

```
npm start
```

then run a local http server. e.g. for [http-server](https://github.com/indexzero/http-server) it is

```
http-server
```

then connect your browser to [http://127.0.0.1:8080/examples](http://127.0.0.1:8080/examples)

Then take your phone, open its web browser and connect it to your web server.
In my case it is like that. Change the ip address to match your case.

[http://192.168.0.2:8080/client](http://192.168.0.2:8080/client)

it will run the controller emulation on your phone

#
