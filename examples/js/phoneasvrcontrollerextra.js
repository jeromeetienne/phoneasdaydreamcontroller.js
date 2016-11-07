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
