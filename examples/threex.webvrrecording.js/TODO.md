- make a pause/seek in the player
- make a keyboard stuff to move in the record, it will help the syncup
- make webvrrecorder.html and gamepadrecorder.html more homogeneous
- put in its own repository and rename it recording-webvr

- file are getting huge... how to do better ?
  - store only delta
  - store in binary
- LATER save in binary - should i record in json ?
  - large files => slow download + huge memory usage
  - what are the alternatives ? to save in binary
  - what about after you did json ?
  - yeah no emergency
- DONE reduce the boilerplate in .html
- DONE rewrite webvr recorder/player with json
- DONE merge with https://github.com/jeromeetienne/threejs-video-augmentedreality


----
- DONE test replay on vive ?
  - possible with only the controller ?
  - why would i require webvr ? i dont think it is required
- DONE put gamepad/webvr recorder/player in a single class ? 
  - overcooked ?
  - threex.jsonplayer.js threex.jsonrecorder.js

----

# Notes
- ability to record data in multiple files
  - there is like a sessions which is recordedAt
  - first files
