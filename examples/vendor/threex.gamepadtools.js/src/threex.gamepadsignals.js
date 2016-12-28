/**
 * @file handle actions signals based on gamepad API
 * - touchStart/touchEnd on any button
 *
 * LATER:                                                                                                                                      
 * - axesChanged when axes value changes
 */

var THREEx = THREEx || {}


THREEx.GamepadSignals = function(){
	var _this = this
	this.signals = {
		touchStart : new signals.Signal(),
		touchEnd : new signals.Signal(),
	}
	
	var wasPresseds = []
	this.update = function(gamepad){
		// create wasPresseds if needed
		for(var buttonIndex = 0; buttonIndex < gamepad.buttons.length; buttonIndex++){
			if( typeof(wasPresseds[buttonIndex]) !== 'boolean' ){
				wasPresseds[buttonIndex] = false
			}
		}

		// detect touchStart and touchEnd on each button
		for(var buttonIndex = 0; buttonIndex < gamepad.buttons.length; buttonIndex++){
			var wasPressed = wasPresseds[buttonIndex]
			var isPressed = gamepad.buttons[buttonIndex].pressed
			// detect touchStart
			if( isPressed === true && wasPressed === false ){
				_this.signals.touchStart.dispatch(buttonIndex, gamepad)
			}
			// detect touchEnd
			if( isPressed === false && wasPressed === true ){
				_this.signals.touchEnd.dispatch(buttonIndex, gamepad)
			}
			// update wasPresseds
			wasPresseds[buttonIndex] = isPressed
		}
	}
}
