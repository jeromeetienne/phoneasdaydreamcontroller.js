var THREEx = THREEx || {}

THREEx.GamepadRecorder = function(){
        THREEx.JsonRecorder.call( this );
        
        this.autoSaveBaseName = 'gamepadrecords'
                
        this._fetchNewRecordData = function(newRecord){
                var gamepads = navigator.getGamepads();
                // clone the struct
                // gamepads = JSON.parse(JSON.stringify(gamepads))
                gamepads = cloneObject(gamepads)
                return gamepads
        }
}
THREEx.GamepadRecorder.prototype = Object.create( THREEx.JsonRecorder.prototype );
THREEx.GamepadRecorder.prototype.constructor = THREEx.GamepadRecorder;
