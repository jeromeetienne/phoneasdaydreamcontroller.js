var PhoneAsDaydreamController = PhoneAsDaydreamController || {}

PhoneAsDaydreamController.Context = function(serverUrl){
	var _this = this
	
	_this.viewQuaternion = [0,0,0,1]

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
		
		if( _this._phones[message.gamepadIndex] !== undefined ){
			console.warn('received a phone connected at index', message.gamepadIndex, 'but already got a phone at this index')
			var phone = _this._phones[message.gamepadIndex]
			phone.dispose()
		}
		
		_this._phones[message.gamepadIndex] =  new PhoneAsDaydreamController.Phone(_this, _this._socket, {
			hand : message.hand,
			gamepadIndex: message.gamepadIndex
		})
	})
	this._socket.on('phonedisconnected', function(message){
		// var event = JSON.parse(message)
		console.log('phonedisconnected', message)

		if( _this._phones[message.gamepadIndex] === undefined ){
			console.warn('received a phone disconnected at index', message.gamepadIndex, 'but already got no phone there')
			return
		}
		var phone = _this._phones[message.gamepadIndex]
		phone.dispose()
		delete _this._phones[message.gamepadIndex]
	})

	this._phones = []

	this.getGamepads = function(){
		var gamepads = [
			null,
			null,
			null,
			null,
		]
		_this._phones.forEach(function(phone){
			var index = phone.gamepad.index
			gamepads[index] = _this._phones[index].gamepad
		})
		return gamepads
	}
}

////////////////////////////////////////////////////////////////////////////////
//          Code Separator
////////////////////////////////////////////////////////////////////////////////

PhoneAsDaydreamController.overloadGamepadsAPI = function(serverUrl){
	var phoneAsDaydreamController = new PhoneAsDaydreamController.Context(serverUrl)
	// save the original navigator.getGamepads - thus it is possible if actual gamepads are connected
	var originalGetGamepads = navigator.getGamepads ? navigator.getGamepads.bind(navigator) : function(){ return [null, null, null, null] }
	// overload gamepads API
	navigator.getGamepads = function(){
		var actualGamepads = originalGetGamepads()
		// test is there is at least one actual gamepad
		var actualGamepadConnected = false
		for( var i = 0; i < actualGamepads.length; i++ ){
			if( actualGamepads[i] )	actualGamepadConnected = true
		}
		// if an actual gamepads are connected, return this one (an not phoneAsDaydreamController ones)
		if( actualGamepadConnected )	return actualGamepads

		// if no actual gamepad is connected, notify the phoneAsDaydreamController ones
        	return phoneAsDaydreamController.getGamepads()
	}
	
	return phoneAsDaydreamController
}
