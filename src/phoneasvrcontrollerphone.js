var PhoneAsVRController = PhoneAsVRController || {}

PhoneAsVRController.Phone = function(context, socket, phoneParameters){
	var _this = this
	
	

	this.gamepad  = JSON.parse(JSON.stringify(PhoneAsVRController.Phone._gamepadTemplate))
	this.gamepad.index = phoneParameters.gamepadIndex
	this.gamepad.hand = phoneParameters.hand
	var gamepad = this.gamepad

	// for calibration
	var lastDeviceOrientationEvent = null
	var originDeviceOrientation = null
	var originViewQuaternion = null

	socket.on('broadcast', onBroadcast)

	var buttonNames = ['appButton', 'homeButton', 'trackpad']

	this.dispose = function(){
		console.log('dispose of phone', _this.gamepad.index)
		socket.removeListener('broadcast', onBroadcast)
	}
	return
	
	function onBroadcast(message){   
		var event = JSON.parse(message)
		
		if( event.gamepadIndex !== _this.gamepad.index )	return
		
		if( event.type === 'deviceOrientationReset' ){
			originDeviceOrientation = null
			originViewQuaternion = null
			// reinit device orientation
			if( lastDeviceOrientationEvent ){
				onDeviceOrientation(lastDeviceOrientationEvent)
			}
		}else if( event.type === 'deviceOrientation' ){
			onDeviceOrientation(event)
		}else if( event.type === 'touchstart' ){
			var index = buttonNames.indexOf(event.target)
			// console.log('new touchstart gamepadindex', _this.gamepad.index, 'button', index)
			console.assert( index !== -1 )
			gamepad.buttons[index].pressed = true
			gamepad.buttons[index].value = 1
		}else if( event.type === 'touchend' ){
			var index = buttonNames.indexOf(event.target)
			console.assert( index !== -1 )
			gamepad.buttons[index].pressed = false
			gamepad.buttons[index].value = 0
		}
		// update axes[0] with trackpad
		if( event.target === 'trackpad' && ['touchstart', 'touchmove'].indexOf(event.type) !== -1 ){
			gamepad.axes[0] = [
				event.positionX,
				event.positionY
			]
		}
	}

	function onDeviceOrientation(event){
		lastDeviceOrientationEvent = event

                // console.log('new deviceOrientation', _this.gamepad.index, event)
		if( originDeviceOrientation === null ){
			originDeviceOrientation = {
				alpha: event.alpha,
				beta: event.beta,
				gamma: event.gamma
			}
		}
		if( originViewQuaternion === null ){
			originViewQuaternion = new THREE.Quaternion().fromArray(context.viewQuaternion)
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
		var poseQuaternion = originViewQuaternion.clone().multiply( controllerQuaternion )
		poseQuaternion.toArray(gamepad.pose.orientation)
		
	}
}




//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

// general spec for Gamepad API - https://www.w3.org/TR/gamepad/
PhoneAsVRController.Phone._gamepadTemplate = {
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
