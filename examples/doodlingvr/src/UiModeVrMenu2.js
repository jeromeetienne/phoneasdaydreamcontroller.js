function UiModeVrMenu2(app, menuItems){
	UiMode.call( this );
	var _this = this
	this.signals = {
		select : new signals.Signal()
	}
	console.log('create menu')
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
	
	var vrButtons = []
	
	var rootObject = new THREE.Group
	scene.add(rootObject)
	
	Object.keys(menuItems).forEach(function(itemKey, index){
		var itemValue = menuItems[itemKey]
		var vrButton = new THREEx.VRButton(itemValue)
		vrButton.object3d.scale.multiplyScalar(1/2)
		vrButton.object3d.userData.vrMenuItemKey = itemKey

		vrButtons.push(vrButton)
		rootObject.add(vrButton.object3d)		
	})

	updatePositions()


	function updatePositions(){
		vrButtons.forEach(function(vrButton, index){
			var maxWidth = 4
			var position = new THREE.Vector3
			position.x = -2 + (index % maxWidth) * 1.2
			position.y = -2 -Math.floor(index / maxWidth)*0.3
			position.z = -4

			app.camera.localToWorld(position)
			vrButton.object3d.position.copy(position)

			// make the menu facing the camera
			vrButton.object3d.lookAt(app.camera.position)
		})
	}

	app.gamepadSignals.signals.touchStart.add(onTouchStart)
	this.dispose = function(){
console.log('dispose menu')
		app.gamepadSignals.signals.touchStart.remove(onTouchStart)
		scene.remove(rootObject)
	}


	this.getActionableObjects = function(){
		var itemsBack = []
		vrButtons.forEach(function(vrButton){
			itemsBack.push(vrButton.itemBack)
		})
		return itemsBack
	}

	var intersects = []
	this.update = function(){
		updatePositions()
		
		intersects	= app.intersects

		_this.getActionableObjects().forEach(function(itemBack){
			itemBack.material.color.set('black')
			itemBack.position.z = 0.5
		})

		if( intersects.length === 0 )	return

		var itemBack = intersects[0].object
		itemBack.material.color.set('cyan')
		itemBack.position.z = 0
	}
	
	return

	function onTouchStart(buttonIndex){
		if( buttonIndex !== 0 )	return
		if( intersects.length === 0 )	return
		var object3d = intersects[0].object
		
		var itemKey = object3d.parent.userData.vrMenuItemKey
		console.log('just selected', itemKey)
		_this.signals.select.dispatch(itemKey)
	}
}

UiModeVrMenu2.prototype = Object.create( UiMode.prototype );
UiModeVrMenu2.prototype.constructor = UiModeVrMenu2;
