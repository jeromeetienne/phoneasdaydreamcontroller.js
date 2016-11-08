function PhoneAsVRControllerExtra(){
	var _this = this
	PhoneAsVRController.call( this );
	
	this.signals = {
		touchGesture : new signals.Signal(),
		voiceCommand : new signals.Signal(),
		touchStart : new signals.Signal(),
		touchEnd : new signals.Signal(),
	}
	
	forwardEvent('touchGesture')
	
	function forwardEvent(eventName){
		_this._socket.on('broadcast', function(message){   
			var event = JSON.parse(message)
			if( event.type !== eventName ) return
		console.log('dispatch', eventName)
			_this.signals[eventName].dispatch(event)
		})
	}
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
