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
	
	this._socket.on('phoneconnected', function(message){
		// var event = JSON.parse(message)
		console.log('phoneconnected', message)
	})
	this._socket.on('phonedisconnected', function(message){
		// var event = JSON.parse(message)
		console.log('phonedisconnected', message)
	})

	this._gamepads = [
		undefined,
		undefined,
		undefined,
		undefined,
	]

	this._gamepads[0] =  new PhoneAsVRController.Gamepad(this, 0)

	// FIXME remote that
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
