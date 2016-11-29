var Appx = Appx || {}

Appx.App = function(){
	var _this = this
	var serverUrl = 'http://'+location.hostname+':4000'
	var phoneAsVRController = new PhoneAsVRController.Context(serverUrl);
	// update phoneAsVRController.viewQuaternion for recalibration
	onRenderFcts.push(function(){
		phoneAsVRController.viewQuaternion = camera.quaternion.toArray()
	})
	
	_this.camera = camera

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
	_this._uiMenu = null

	var raycaster = null
	_this.intersects = []
	onRenderFcts.push(function(){
		var gamepad = getGamepad()
		if( gamepad === null )	return
		controller.updatePosition(camera, gamepad)

		gamepadSignals.update(gamepad)
		
		var actionableObjects = _this._uiMode.getActionableObjects(app)
		actionableObjects = actionableObjects.concat( _this._uiMenu.getActionableObjects(app) )
		
		raycaster = controller.getRaycaster()
		
		// compute intersects
		_this.intersects	= raycaster.intersectObjects( actionableObjects, true );
		
		_this._uiMode.update(app)
		_this._uiMenu.update(app)
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

	// start the first uiMode
	_this._gotoUiMode('vrMenu')
	_this._uiMenu = _this._uiMode
	_this._uiMode = null

	_this._gotoUiMode('select')

	////////////////////////////////////////////////////////////////////////////////
	//          Handle long press traclpad to toggle menu
	////////////////////////////////////////////////////////////////////////////////
	// this._initTrackpadToggleMenu()
	
	//////////////////////////////////////////////////////////////////////////////
	//		Handle gestures
	//////////////////////////////////////////////////////////////////////////////
	this._gestures = new THREEx.VrGestures(gamepadSignals)
	this._gestures.signals.swipe.add(function(direction){
		console.log('app swipe', direction)
		
		// if swipe left, then delete selected object
		if( direction === 'left' && _this.selected !== null ){
			console.log('swipe left => deleteSelected')
			_this._gotoUiMode('deleteSelected')
		}
		if( direction === 'up' && _this.selected !== null ){
			console.log('swipe up => biggerSelected')
			_this.selected.scale.multiplyScalar(1.2)
		}
		if( direction === 'down' && _this.selected !== null ){
			console.log('swipe down => smallerSelected')
			_this.selected.scale.multiplyScalar(1/1.2)
		}
		if( direction === 'right' && _this.selected !== null ){
			console.log('swipe right => cloneSelected')
			_this._gotoUiMode('cloneSelected')
		}
	})
}

Appx.App.prototype.select = function(object3d){
	if( this.selected !== null )	this.selected.material.color.set('white')
	this.selected = object3d
	if( this.selected !== null ) this.selected.material.color.set('hotpink')	
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

	console.log('switching to uiMode', uiModeType)

	// create new uiMode
	if(uiModeType === 'select'){
		_this._uiMode = new UiModeSelect(this)
		_this._uiMode.signals.select.add(function(selected){
			_this.select(selected)
		})
	}else if(uiModeType === 'vrMenu'){
		var menuItems = {
			'select' : 'Select',
			'controllerOrientation' : 'Controller Orientation',
			'objectTranslation' : 'Translate',
			'objectRotation' : 'rotate',
			'objectScale' : 'scale',
			'deleteSelected' : 'delete',
			'createObject' : 'create Object',
			'cloneSelected' : 'clone Object',
		}
		_this._uiMode = new UiModeVrMenu(this, menuItems)
		_this._uiMode.signals.select.add(function(itemKey){
			if( itemKey === 'objectTranslation' || itemKey === 'objectRotation' || itemKey === 'objectScale' ){
				if( _this.selected === null ) alert('PANIC!! NO OBJECT SELECTED!!')
			}
			_this._gotoUiMode(itemKey)
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
	}else if(uiModeType === 'cloneSelected'){
		_this._uiMode = new UiModeCloneSelected(this)
		_this._uiMode.signals.completed.add(function(selected){
			_this.select(selected)
			_this._gotoUiMode('select')
		})
	}else console.assert(false)
}
