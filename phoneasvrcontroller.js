function PhoneAsVRController(){
	// general spec for Gamepad API - https://www.w3.org/TR/gamepad/
	var gamepad = {
		'id' : 'PhoneAsGamepad.js Controller',
		'index' : 0,
		'connected' : true,
		'mapping' : 'standard',
		'axes' : [],
		'buttons' : [{
			'pressed' : false,
			'touched' : false,
			'value' : 0,
		}, {
			'pressed' : false,
			'touched' : false,
			'value' : 0,		
		}],
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

	var serverUrl = 'http://127.0.0.1:3000'
	var socket = io(serverUrl);
	this._socket = socket

	var firstAngle = null	
	socket.on('broadcast', function(message){   
		var event = JSON.parse(message)

		if( event.type === 'deviceOrientation' ){
	                // console.log('broadcast', message)
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

			var quaternion = new THREE.Quaternion().setFromEuler(euler)
	                quaternion.toArray(gamepad.pose.orientation)
		}else if( event.type === 'touchstart' ){
			if( event.target === 'appButton' ){
				gamepad.buttons[0].pressed = true
				gamepad.buttons[0].value = 1
			}else if( event.target === 'homeButton' ){
				gamepad.buttons[1].pressed = true
				gamepad.buttons[1].value = 1
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
			}else{
				console.assert(false)
			}
		}
	})	
}

////////////////////////////////////////////////////////////////////////////////
//          Code Separator
////////////////////////////////////////////////////////////////////////////////

PhoneAsVRController.overloadGetpadsAPI = function(){
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
