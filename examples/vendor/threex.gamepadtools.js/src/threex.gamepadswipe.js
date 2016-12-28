var Appx = Appx || {}

THREEx.GamepadSwipe = function(gamepadSignals){
	var _this = this
        this.signals = {
                swipe : new signals.Signal(),
        }
	
	//////////////////////////////////////////////////////////////////////////////
	//		init SwipeDetector
	//////////////////////////////////////////////////////////////////////////////
	var swipeDetector = new SwipeDetector()
	gamepadSignals.signals.touchStart.add(function(buttonIndex, gamepad){	
		if(buttonIndex !== 2)	return	

		var x = gamepad.axes[0][0]/2 + 0.5
		var y = gamepad.axes[0][1]/2 + 0.5
		swipeDetector.start(x,y);
	})

	gamepadSignals.signals.touchEnd.add(function(buttonIndex, gamepad){
		if(buttonIndex !== 2)	return	

		var x = gamepad.axes[0][0]/2 + 0.5
		var y = gamepad.axes[0][1]/2 + 0.5
		swipeDetector.end(x,y);
	})
	
	// forward the signals
	swipeDetector.signals.swipe.add(function(direction){
		_this.signals.swipe.dispatch(direction)
	})

}
