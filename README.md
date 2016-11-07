# phonegamepad
use your phone as a gamepad (3dof Virtual reality gamepad).

It is quite early stage, looking forward to have that in the ray-input

# Instruction
- start the websocket server ```node index.js```
- enter the url of the server on your phone, e.g. ```http://192.168.0.2:3000```
  - you will see the gamepad page
- start a static http server, e.g. ```http-server```
- open ```http:127.0.0.1:8080/examples/webvr.html``` for an example of 3dof controller

# Future
- pass examples/webvr.js on phoneasvrcontroller.js
- handle transcript with web speech api
- add a awakelock - like the one in webvr-polyfill
- plug it in ray-input
