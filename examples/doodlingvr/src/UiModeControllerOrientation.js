function UiModeControllerOrientation(app){
	var _this = this
	UiMode.call( this );
	
	this.signals = {
		completed : new signals.Signal()
	}
	
	console.assert(app.selected!== null)
	
	var originSelectedQuat = app.selected.quaternion.clone()
	var originControllerQuat = app.controller.object3d.quaternion.clone()
	
	app.gamepadSignals.signals.touchStart.add(onTouchStart)
	
	this.dispose = function(){
		app.gamepadSignals.signals.touchStart.remove(onTouchStart)
	}

	this.update = function(){
		var controllerQuaternion = app.controller.object3d.quaternion.clone()
			.multiply(originControllerQuat.clone().inverse())

		app.selected.quaternion.copy(originSelectedQuat)
			.multiply(controllerQuaternion)
	}
	return

	function onTouchStart(buttonIndex){
		if( buttonIndex !== 0 )	return
		
		_this.signals.completed.dispatch()
	}
}

UiModeControllerOrientation.prototype = Object.create( UiMode.prototype );
UiModeControllerOrientation.prototype.constructor = UiModeControllerOrientation;
