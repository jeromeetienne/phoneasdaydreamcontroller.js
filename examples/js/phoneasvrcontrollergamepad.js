var PhoneAsVRController = PhoneAsVRController || {}

PhoneAsVRController.Gamepad = function(context, gamepadIndex){
	var _this = this

	var gamepad = JSON.parse(JSON.stringify(PhoneAsVRController.Gamepad._gamepadTemplate))
	this.gamepad = gamepad


	var originDeviceOrientation = null
	this.onDeviceOrientationReset = function(){}
	context._socket.on('broadcast', function(message){   
		var event = JSON.parse(message)
		
		// console.log(event.gamepadIndex, gamepadIndex )
		
		if( event.gamepadIndex !== gamepadIndex )	return
		
		if( event.type === 'deviceOrientationReset' ){
			originDeviceOrientation = null
			_this.onDeviceOrientationReset()
		}else if( event.type === 'deviceOrientation' ){
	                // console.log('new deviceOrientation', message)
			if( originDeviceOrientation === null ){
				originDeviceOrientation = {
					alpha: event.alpha,
					beta: event.beta,
					gamma: event.gamma
				}
			}
			
			var alpha = event.alpha - originDeviceOrientation.alpha
                        var beta  = event.beta  - originDeviceOrientation.beta
                        var gamma = event.gamma - originDeviceOrientation.gamma

			var deviceEuler = new THREE.Euler()
			deviceEuler.x =  beta  / 180 * Math.PI
			deviceEuler.y =  alpha / 180 * Math.PI
			deviceEuler.z = -gamma / 180 * Math.PI
			deviceEuler.order = "YXZ"

			// FIXME here i include the whole three.js for this loosy line... let avoid that ...
			var controllerQuaternion = new THREE.Quaternion().setFromEuler(deviceEuler)			
	                controllerQuaternion.toArray(gamepad.pose.orientation)
		}else if( event.type === 'touchstart' ){
			if( event.target === 'appButton' ){
				gamepad.buttons[0].pressed = true
				gamepad.buttons[0].value = 1
			}else if( event.target === 'homeButton' ){
				gamepad.buttons[1].pressed = true
				gamepad.buttons[1].value = 1
			}else if( event.target === 'trackpad' ){
				gamepad.buttons[2].pressed = true
				gamepad.buttons[2].value = 1				
			}else{
				console.assert(false)
			}
		}else if( event.type === 'touchend' ){
			if( event.target === 'appButton' ){
				gamepad.buttons[0].pressed = false
				gamepad.buttons[0].value = 0
			}else if( event.target === 'homeButton' ){
				gamepad.buttons[1].pressed = false
				gamepad.buttons[1].value = 0
			}else if( event.target === 'trackpad' ){
				gamepad.buttons[2].pressed = false
				gamepad.buttons[2].value = 0
			}else{
				console.assert(false)
			}
		}
		
		if( event.target === 'trackpad' && ['touchstart', 'touchmove', 'touchend'].indexOf(event.type) !== -1 ){
			gamepad.axes[0] = [
				event.positionX,
				event.positionY
			]
		}
	})	
}




//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

// general spec for Gamepad API - https://www.w3.org/TR/gamepad/
PhoneAsVRController.Gamepad._gamepadTemplate = {
	'id' : 'PhoneAsGamepad.js Controller',
	'index' : 0,
	'connected' : true,
	'mapping' : 'standard',
	'axes' : [
		[0,0]
	],
	'buttons' : [{
		'pressed' : false,
		'value' : 0,
	}, {
		'pressed' : false,
		'value' : 0,		
	}, {
		'pressed' : false,
		'value' : 0,		
	}],
	// Hand extension - https://w3c.github.io/gamepad/extensions.html#dom-gamepadhand
	'hand' : 'left',
	// VR extension - https://w3c.github.io/gamepad/extensions.html#dom-gamepadpose
	'pose' : {
		'hasPosition' : false,
		'hasOrientation' : true,
		
		'position' : null,
		'linearVelocity' : null,
		'linearAcceleration' : null,
		
		'orientation' : [0,0,0,1],
		'angularVelocity' : null,
		'angularAcceleration' : null
	}
}
