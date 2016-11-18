var Appx = Appx || {}

Appx.App = function(){
	var _this = this
	var serverUrl = 'http://'+location.hostname+':4000'
	var phoneAsVRController = new PhoneAsVRController.Context(serverUrl);
	

	function getGamepad(){
		// var gamepads = navigator.getGamepads()
		var gamepads = phoneAsVRController.getGamepads()
		for(var i = 0; i < gamepads.length; i++){
			var gamepad = gamepads[i]
			if( gamepad === undefined )	continue
			return gamepad
		}
		return null
	}
	this.getGamepad = getGamepad

	//////////////////////////////////////////////////////////////////////////////
	//		Code Separator
	//////////////////////////////////////////////////////////////////////////////

	var controller = new THREEx.DaydreamController()
	_this.controller = controller
	scene.add(controller.object3d)

	var gamepadSignals = new THREEx.GamepadSignals()
	_this.gamepadSignals = gamepadSignals

	_this._uiMode = null

	var raycaster = null
	_this.intersects = []
	onRenderFcts.push(function(){
		var gamepad = getGamepad()
		if( gamepad === null )	return
		controller.updatePosition(camera, gamepad)

		gamepadSignals.update(gamepad)
		
		var actionableObjects = _this._uiMode.getActionableObjects(app)
		
		raycaster = controller.getRaycaster()
		
		// compute intersects
		_this.intersects	= raycaster.intersectObjects( actionableObjects, true );
		
		_this._uiMode.update(app)
	})
	
	//////////////////////////////////////////////////////////////////////////////
	//		set laser beam  length according to intersects
	//////////////////////////////////////////////////////////////////////////////
	onRenderFcts.push(function(){
		if( _this.intersects.length > 0 ){
			var position	= _this.intersects[0].point
			var distance	= position.distanceTo(raycaster.ray.origin)
			controller._laserBeam.setLength(distance)
		}else{
			controller._laserBeam.setLength(10)
		}
	})
	
	//////////////////////////////////////////////////////////////////////////////
	//		Code Separator
	//////////////////////////////////////////////////////////////////////////////
	
	
	_this.selected = null
	_this._postSelectUiMode = 'vrMenu'


	// setup initial mode
	_this._gotoUiMode('select')

	////////////////////////////////////////////////////////////////////////////////
	//          Handle long press traclpad to toggle menu
	////////////////////////////////////////////////////////////////////////////////
	this._initTrackpadToggleMenu()
}

/**
 * to switch betwen uiMode
 */
Appx.App.prototype._gotoUiMode = function(uiModeType){
	var _this = this
	// dispose of old uiMode
	if(_this._uiMode !== null ){
		_this._uiMode.dispose()
	}

	// create new uiMode
	if(uiModeType === 'select'){
		_this._uiMode = new UiModeSelect(this)
		_this._uiMode.signals.select.add(function(object3d){
			if( _this.selected !== null )	_this.selected.material.color.set('white')
			_this.selected = object3d
			if( _this.selected !== null ) _this.selected.material.color.set('hotpink')

			// honor _this._postSelectUiMode
			if( _this.selected !== null && _this._postSelectUiMode ) _this._gotoUiMode(_this._postSelectUiMode)
		})
	}else if(uiModeType === 'vrMenu'){
		_this._uiMode = new UiModeVrMenu(this)
		_this._uiMode.signals.select.add(function(itemKey){
			if( itemKey === 'select' ){
				_this._gotoUiMode('select')
			}else if( itemKey === 'objectTranslation' || itemKey === 'objectRotation' || itemKey === 'objectScale' ){
				if( _this.selected === null ) alert('PANIC!! NO OBJECT SELECTED!!')
				_this._gotoUiMode(itemKey)
			}else if( itemKey === 'controllerOrientation' ){
				_this._gotoUiMode('controllerOrientation')					
			}else if( itemKey === 'deleteSelected' ){
				_this._gotoUiMode('deleteSelected')					
			}else if( itemKey === 'createObject' ){
				_this._gotoUiMode('createObject')					
			}else   console.assert(false)
		})
	}else if(uiModeType === 'objectTranslation' || uiModeType === 'objectRotation' || uiModeType === 'objectScale'){
		if( uiModeType === 'objectTranslation')	var mode = 'translation'
		if( uiModeType === 'objectRotation' )	var mode = 'rotation'
		if( uiModeType === 'objectScale' )	var mode = 'scale'
		_this._uiMode = new UiModeObjectPosRotSca(this, mode, 'planeXY')
		_this._uiMode.signals.completed.add(function(){
			_this._gotoUiMode('select')
		})
	}else if(uiModeType === 'controllerOrientation'){
		_this._uiMode = new UiModeControllerOrientation(this)
		_this._uiMode.signals.completed.add(function(){
			_this._gotoUiMode('select')
		})
	}else if(uiModeType === 'deleteSelected'){
		_this._uiMode = new UiModeDelete(this)
		_this._uiMode.signals.completed.add(function(){
			_this._gotoUiMode('select')
		})
	}else if(uiModeType === 'createObject'){
		_this._uiMode = new UiModeCreateObject(this)
		_this._uiMode.signals.completed.add(function(){
			_this._gotoUiMode('select')
		})
					
	}else console.assert(false)
}

/**
 * init the vrMenu by trackpad long press
 */
Appx.App.prototype._initTrackpadToggleMenu = function () {
	var _this = this
	var timerId = null
	// handle touchStart
	this.gamepadSignals.signals.touchStart.add(function(buttonIndex){
		if( buttonIndex !== 2 )	return	
		stopTimerIfNeeded()	
		timerId = setTimeout(function(){
			stopTimerIfNeeded()
			if( _this._uiMode instanceof UiModeVrMenu === false ){
				_this._gotoUiMode('vrMenu')
			}else{
				_this._gotoUiMode('select')						
			}
		}, 1000*0.5)
	})
	// handle touchEnd
	this.gamepadSignals.signals.touchEnd.add(function(buttonIndex){
		if( buttonIndex !== 2 )	return	
		stopTimerIfNeeded()
	})
	return
	
	function stopTimerIfNeeded(){
		if( timerId !== null ) clearTimeout(timerId)
		timerId = null			
	}
};
