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

THREEx.GamepadPlayer.cookedLoad = function(baseUrl, nRecordsFiles, onLoaded){
	// var nRecordsFiles = 3
	// build the urls of the file to load
	var urls = []
	for(var i = 0; i < nRecordsFiles; i++){
		urls.push(baseUrl+pad(i, 4)+'.json')
	}
	// start loading those urls
	var gamepadPlayer = new THREEx.GamepadPlayer()
	gamepadPlayer.load(urls, function(){
		console.log('loaded all gamepad records')
                onLoaded && onLoaded(gamepadPlayer)	
	})
	// polyfill to high-jack gamepad API
	navigator.getGamepads = function(){
		return gamepadPlayer.gamepads
	}
        
        return gamepadPlayer
        
	function pad(num, size) {
                var s = num + '';
                while (s.length < size) s = '0' + s;
                return s;
        }
}
