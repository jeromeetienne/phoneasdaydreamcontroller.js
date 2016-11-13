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
		
		_this._gamepads[message.gamepadIndex] =  new PhoneAsVRController.Gamepad(_this, {
			hand : message.hand,
			gamepadIndex: message.gamepadIndex
		})
	})
	this._socket.on('phonedisconnected', function(message){
		// var event = JSON.parse(message)
		console.log('phonedisconnected', message)

		var gamepad = _this._gamepads[message.gamepadIndex]
		gamepad.dispose()
		delete _this._gamepads[message.gamepadIndex]
	})

	this._gamepads = []

	this.getGamepads = function(){
		var gamepads = [
			undefined,
			undefined,
			undefined,
			undefined,
		]
		_this._gamepads.forEach(function(gamepad){
			gamepads[gamepad.gamepad.index] = _this._gamepads[gamepad.gamepad.index]
		})
		return _this._gamepads
	}

	// this._gamepads[0] =  new PhoneAsVRController.Gamepad(this, {
	// 	hand : 'right',
	// 	gamepadIndex: 0
	// })

	// FIXME remote that
	// this.gamepad = this._gamepads[0].gamepad
}


////////////////////////////////////////////////////////////////////////////////
//          Code Separator
////////////////////////////////////////////////////////////////////////////////
// 
// PhoneAsVRController.overloadGamepadsAPI = function(){
// 	var phoneAsVRController = new PhoneAsVRController()
// 	navigator.getGamepads = function(){
//         	var gamepads = [ 
// 			phoneAsVRController.gamepad,
// 			undefined,
// 			undefined,
// 			undefined,
// 		]
// 		return gamepads
// 	}	
// }
