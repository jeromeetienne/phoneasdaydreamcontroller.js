var PhoneAsVRController = PhoneAsVRController || {}

PhoneAsVRController.Context = function(serverUrl){
	var _this = this

	this._socket = io(serverUrl, {
		query : 'origin=app'
	});

	this._socket.on('connect', function(){
		console.log('connected phone server')
	})
	this._socket.on('disconnect', function(){
		console.log('disconnected phone server')
	})
	
	this._socket.on('gamepadconnected', function(message){
		var event = JSON.parse(message)
	})
	this._socket.on('gamepaddisconnected', function(message){
		var event = JSON.parse(message)
	})

	this._gamepads = [
		undefined,
		undefined,
		undefined,
		undefined,
	]

	this._gamepads[0] =  new PhoneAsVRController.Gamepad(this, 0)

	this.gamepad = this._gamepads[0].gamepad
}


////////////////////////////////////////////////////////////////////////////////
//          Code Separator
////////////////////////////////////////////////////////////////////////////////

PhoneAsVRController.overloadGamepadsAPI = function(){
	var phoneAsVRController = new PhoneAsVRController()
	navigator.getGamepads = function(){
        	var gamepads = [ 
			phoneAsVRController.gamepad,
			undefined,
			undefined,
			undefined,
		]
		return gamepads
	}	
}
