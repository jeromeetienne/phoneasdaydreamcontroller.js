# to fix for mvp
- FIXME: rotateSelected doesnt work
- FIXME: issue with selected when i clone. cloning should select the cloned one and unselect the original
- TODO: support dragSelected
- TODO: make the server accept multiple app at the same time


- TODO clean up /examples/js if possible ?

- TODO: find a good workflow for dooglinvr
  - all the selected required operation. should be better detected
  - TODO: vrMenu if i click outside the menu and vrmenu visible, hide vrmenu
  - TODO: if click on a object while on the menu, then select the object and keep the menu

# Done
- DONE: fix the issue with '2 gamepads diconnecting reconnecting'
  - occurs in examples/basic.html - this localize the issue
  - there is an issue which happen when you reload gamepad page on the devices
  - one got kinda disconnected
  - modify client/ to get the hand/index/serverconnected/appconnected
  - put it at the bottom of the screen with pointer-event none
  - check it works in webvr examples
- DONE: change webvr example
  - same as ray-input
- DONE css3d controller recalibration is not working
- DONE fix recalibration code... this dependancy on the camera is dirty
  - what about a Context.viewQuaternion which should be set externally ? YES DO IT
  - thus if it isnt set, all still work, except calibration is always facing identity
  - started but still unsure
- DONE: in css3d, use swipe to scroll list
- DONE: have minimal docs in README.md  
  - what is this effort ? goals and current state
  - what is the future ?
- DONE clean up the whole repository as much as needed
  - reorga the /examples/js folders
  - put phoneasvrcontrollercontext.js and phoneasvrcontrollerphone.js in a /src
  - DONE create a ```/examples/gesture``` and copy all the dependancies from gesture in it
  - DONE same for css3d
  - DONE same for webvr ? where to put what is shared ?
- DONE import the ray-input examples in /examples
- DONE: recompile ray.js to avoid the silly debug print
- DONE FIXME: sometime the trackpad send coord > 1.0 
  - some asserts popup in swipedetector.js
  - likely an issue in /client itself
- DONE put a div info in each examples ? no it pollute on mobile or vr display
- DONE: fix the socket.io location issue with the various npm
  - force npmv3 to use nested folders
- DONE: menu popping up behind the object
  - should be a double render
  - i added a depthTest: false, it isnt perfect but good for now
- DONE comment the uimode.js stuff
- DONE put the ui in headspace at the bottom of the screen
  - like with the threex.vrbutton, one button per operation
  - remove the threex.vr menu ?
- DONE remove arm model stuff as it is not working now
- DONE fix vrMenu orientation - do a lookat camera at every render
- DONE reenable css3d examples
- DONE rename Appx.Gestures as threex.vrgestures
- DONE hook all swipes
  - swipe up => increase size
  - swipe down => decrease size
  - swipe left => delete selected
  - swipe right => clone selected

# Later
- when menu is displayed, the swipe should be to navigate the menu
