# phoneasvrcontroller.js
It make your phone act as a daydream vr controller. Thus you can start experimenting
with daydream vr without a pixel phone or daydream viewer.

phoneasvrcontroller.js uses your phone as a gamepad (3dof Virtual reality gamepad).
It is widely inspired by daydream controller.
In fact, originally i wrote this to experiment on daydream, but i could not 
get my hand on a Pixel Phone and its daydream viewer. So i wrote this 
emulator to start experimenting now :) 

This repository contains the phoneasvrcontroller library that you can reuse.
My experimentations are in the ```/examples``` folder.

# Get Started

To run the examples, first do install node modules for the websocket server

```
npm install
```

Then start to run the websocket server 

```
npm start
```

then run a local http server. e.g. for [http-server](https://github.com/indexzero/http-server) it is

```
http-server
```

then connect your vr viewer browser to [http://127.0.0.1:8080/examples](http://127.0.0.1:8080/examples) and 
pick 'doodlingvr'.

Then take your phone, open its web browser and connect it to your web server.
In my case it is like that. Change the ip address to match your case.

[http://192.168.0.2:8080/examples](http://192.168.0.2:8080/examples) and pick 'phone controller'

it will run the controller emulation on your phone. Aka a daydream kind of controller (orientation, one trackpad and 3 button)

# Misc

- It it possible to use it with [ray-input](https://github.com/borismus/ray-input) too.
  Go [here](https://github.com/jeromeetienne/ray-input/blob/phone-as-vr-controller/phoneasvrcontroller.html#L30) to see how it can be done.
- To learn more about daydream controller, i used the [documentation for their unity plugin](https://developers.google.com/vr/unity/controller-basics).
