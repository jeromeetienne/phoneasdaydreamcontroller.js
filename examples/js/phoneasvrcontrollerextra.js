function PhoneAsVRControllerExtra(){
	var _this = this
	PhoneAsVRController.call( this );
	
	this.onVoiceCommand = function(text){}
	
	this._socket.on('broadcast', function(message){   
		var event = JSON.parse(message)
		if( event.type !== 'voiceCommand' ) return

		var transcript = event.text
		_this.onVoiceCommand(event.text)
	})
	
	//////////////////////////////////////////////////////////////////////////////
	//		honor trackpad gesture
	//////////////////////////////////////////////////////////////////////////////
	this.requestedGestures = {
		swipeup : false,
		swipedown : false,
	}
	this._socket.on('broadcast', function(message){   
		var event = JSON.parse(message)
		if( event.type !== 'touchGesture' ) return

		var gesture = event.gesture
		console.log('gesture', gesture)
		if( gesture === 'swipeup' ){
			_this.requestedGestures.swipeup = true
		}else if( gesture === 'swipedown' ){
			_this.requestedGestures.swipedown = true
		}
	})
}
PhoneAsVRControllerExtra.prototype = Object.create( PhoneAsVRController.prototype );
PhoneAsVRControllerExtra.prototype.constructor = PhoneAsVRControllerExtra;

PhoneAsVRControllerExtra.prototype.say = function(text){
	console.log('broadcast say', text)
	var event = {
		type : 'say',
		text : text
	}
	this._socket.emit('broadcast', JSON.stringify(event))
}
