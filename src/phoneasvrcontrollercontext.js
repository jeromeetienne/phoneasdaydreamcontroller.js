var PhoneAsVRController = PhoneAsVRController || {}

PhoneAsVRController.Context = function(serverUrl, camera){
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
		
		_this._phones[message.gamepadIndex] =  new PhoneAsVRController.Phone(_this, _this._socket, {
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
			undefined,
			undefined,
			undefined,
			undefined,
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

PhoneAsVRController.overloadGamepadsAPI = function(serverUrl, camera){
	var phoneAsVRController = new PhoneAsVRController.Context(serverUrl, camera)

	navigator.getGamepads = function(){
        	return phoneAsVRController.getGamepads()
	}	
}
