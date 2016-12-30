var THREEx = THREEx || {}

THREEx.GamepadPlayer = function(){
        THREEx.JsonPlayer.call( this );
        
        this.gamepads = [
                null,
                null,
                null,
                null,
        ]
        
        this._onNewRecord = function(newRecord){
                this.gamepads = newRecord
        }
        
}
THREEx.GamepadPlayer.prototype = Object.create( THREEx.JsonPlayer.prototype );
THREEx.GamepadPlayer.prototype.constructor = THREEx.GamepadPlayer;
