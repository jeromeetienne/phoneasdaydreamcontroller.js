function PhoneAsVRController(serverUrl){
	// general spec for Gamepad API - https://www.w3.org/TR/gamepad/
	var gamepad = {
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
	this.gamepad = gamepad

	var socket = io(serverUrl);
	this._socket = socket
	
	socket.on('connect', function(){
		console.log('connected phone server')
	})
	socket.on('disconnect', function(){
		console.log('disconnected phone server')
	})

	var firstAngle = null	
	var initCameraQuaternion = null
	socket.on('broadcast', function(message){   
		var event = JSON.parse(message)

		if( event.type === 'deviceOrientationReset' ){
			console.log('deviceOrientationReset', message)
			firstAngle = null
			initCameraQuaternion = null
		}else if( event.type === 'deviceOrientation' ){
	                // console.log('new deviceOrientation', message)
			if( firstAngle === null ){
				firstAngle = {
					alpha: event.alpha,
					beta: event.beta,
					gamma: event.gamma
				}
			}

			var alpha = event.alpha - firstAngle.alpha
                        var beta  = event.beta  - firstAngle.beta
                        var gamma = event.gamma - firstAngle.gamma

			var euler = new THREE.Euler()
			euler.x =  beta  / 180 * Math.PI
			euler.y =  alpha / 180 * Math.PI
			euler.z = -gamma / 180 * Math.PI
			euler.order = "YXZ"
			// FIXME here i include the whole three.js for this loosy line... let avoid that ...
			var phoneQuaternion = new THREE.Quaternion().setFromEuler(euler)
			
			if(initCameraQuaternion === null){
				initCameraQuaternion = camera.quaternion.clone()	
			}
			var cameraQuaternion = initCameraQuaternion.clone();
			cameraQuaternion.multiply( phoneQuaternion )
			
	                cameraQuaternion.toArray(gamepad.pose.orientation)
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

////////////////////////////////////////////////////////////////////////////////
//          Code Separator
////////////////////////////////////////////////////////////////////////////////

PhoneAsVRController.overloadGamepadsAPI = function(){
	var phoneAsVRController = new PhoneAsVRController()
	navigator.getGamepads = function(){
        	var gamepads = [ 
			phoneAsVRController.gamepad,
			undefined,
			undefined,
			undefined,
		]
		return gamepads
	}	
}
