# phoneasvrcontroller.js
phoneasvrcontroller.js  makes your phone act as a daydream vr controller. Thus you can start experimenting
with daydream vr without a pixel phone or daydream viewer.

phoneasvrcontroller.js uses your phone as a gamepad (3dof Virtual reality gamepad).
It is widely inspired by daydream controller.
In fact, originally i wrote this to experiment on daydream, because i could not 
get my hand on a Pixel Phone and its daydream viewer. So i wrote this 
emulator to start experimenting now :) 

This repository contains the phoneasvrcontroller library that you can reuse.
Technically it exports the data in the same format as the gamepad api.
My experimentations are in the ```/examples``` folder.
You can even have up to 4 phones connected at the same time :)

# Get Started

To run the examples, first do install node modules for the websocket server

```
npm install
```

Note, if you use npm-v3, you need to switch off the new flat package behavior, just
use ```npm install --legacy-bundling``` instead. Then start to run the websocket server 

```
npm start
```

then run a local http server. e.g. for [http-server](https://github.com/indexzero/http-server), it is

```
http-server
```

then connect your vr viewer browser to [http://127.0.0.1:8080/examples](http://127.0.0.1:8080/examples) and 
pick 'doodlingvr'.

Then take your phone, open its web browser and connect it to your web server.
In my case it is like that. Change the ip address to match your case.

[http://192.168.0.2:8080/examples](http://192.168.0.2:8080/examples) and pick 'phone controller'

it will run the controller emulation on your phone. Aka a daydream kind of controller (orientation, one trackpad and 3 button)


# Show, dont Tell

- ```client/``` is the phone controller, aka the webapps which emulate the daydream controller on your phone
- ```examples/basic.html``` simply display the gamepad. raw output of the phone gamepad. Good to debug
- ```examples/doodlingvr/``` doodling in vr : wip application to doodle in VR
- ```examples/ray-input/``` an example to use your phone as 3dof controller in [ray-input](https://github.com/borismus/ray-input).
  I like this one a lot :)
  It gives a better experience to people who got no 3dof controller but got a phone.
  e.g. google cardboard can use a 3dof controller now.
  This make the vr experience more democratic.
  As i see it, the goal is about 'giving the best VR experience possible to as many people as possible'
- ```examples/gestures.html``` gestures : gesture detection on gamepad trackpad - support swipe gesture + one dollar gesture
- ```examples/css3d.html``` an example using css3d
- ```examples/webvr.html``` an example using webvr

# Misc

- To learn more about daydream controller, i used the [documentation for their unity plugin](https://developers.google.com/vr/unity/controller-basics).
- Current the phone read the IMU by using [Device Orientation events](https://www.w3.org/TR/2016/CR-orientation-event-20160818/).
  But in some phones, the gyroscope is quite noisy. It makes it less precise and less confortable.
  It can be helped using sensor fusion tho. 
  See ["Sensor fusion and motion prediction" article](http://smus.com/sensor-fusion-prediction-webvr/) 
  by [Boris Smüs](https://twitter.com/borismus) to understand how it can help and how to code it.
  It has been implemented in [webvr-polyfill](https://github.com/googlevr/webvr-polyfill/tree/master/src/sensor-fusion) too.
  It could be ported if needed in ```/client```.
  
