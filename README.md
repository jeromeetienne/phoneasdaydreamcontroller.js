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
