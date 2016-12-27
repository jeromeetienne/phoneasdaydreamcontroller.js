var THREEx = THREEx || {}

THREEx.LightSaberSounds = function(listener, onLoaded){
	var _this = this
	this.loaded = false
	this.object3d = new THREE.Group()
	this.sounds = {}
	
	// handle gamepadsignals
	_this._gamepadSignals = new THREEx.GamepadSignals()
	
	var saberIsOn = false
	_this._gamepadSignals.signals.touchStart.add(function(buttonIndex){
		if( buttonIndex !== 0 )	return
		if( saberIsOn === false ){
			_this.sounds.saberon.play()
			saberIsOn = true
		}else{
			_this.sounds.saberoff.play()		
			saberIsOn = false			
		}
	})
	
	//////////////////////////////////////////////////////////////////////////////
	//		load all sounds
	//////////////////////////////////////////////////////////////////////////////
	// from @sylvainpv sylvain pollet - https://twitter.com/SylvainPV/status/236255017508671488
	var soundBasenames = ['saberoff', 'saberon', 'saberswing1', 'saberswing2', 'saberswing3']
	var loadingCount = soundBasenames.length
	var audioLoader = new THREE.AudioLoader();
	soundBasenames.forEach(function(soundBasename){
		_this.sounds[soundBasename]= new THREE.PositionalAudio( listener );
		_this.object3d.add( _this.sounds[soundBasename] );

		var url = THREEx.LightSaberSounds.baseURL + 'sounds/'+soundBasename+'.ogg'
		audioLoader.load( url, function( buffer ) {
			_this.sounds[soundBasename].setBuffer( buffer );
			loadingCount--;
			if( loadingCount === 0 ){
				_this.loaded = true
				onLoaded && onLoaded()
			}
		});
	})

	//////////////////////////////////////////////////////////////////////////////
	//		update functions
	//////////////////////////////////////////////////////////////////////////////
	var lastQuaternion = null;
	var clock = new THREE.Clock()
	this.update = function(gamepad){
		var deltaTime = clock.getDelta()

		_this._gamepadSignals.update(gamepad)

		var quaternion = new THREE.Quaternion().fromArray(gamepad.pose.orientation)
		if( lastQuaternion !== null ){
			var difference = quaternion.clone().multiply( lastQuaternion.clone().inverse() )
			var angleDistance = Math.acos(difference.w) * 2;

			angleDistance = angleDistance / deltaTime

			if( angleDistance > 8 ){
				if( _this.sounds.saberswing3.isPlaying === false ) 	_this.sounds.saberswing3.play()
			}else if( angleDistance > 5 ){
				if( _this.sounds.saberswing2.isPlaying === false ) 	_this.sounds.saberswing2.play()
			}else if( angleDistance > 3 ){
				if( _this.sounds.saberswing1.isPlaying === false ) 	_this.sounds.saberswing1.play()
			}
		}
		
		// update last quaternion
		if( lastQuaternion === null ){
			lastQuaternion = quaternion.clone()
		}else{
			lastQuaternion.copy(quaternion)
		}
	}
}

THREEx.LightSaberSounds.baseURL = '../'
