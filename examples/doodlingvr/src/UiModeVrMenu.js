function UiModeVrMenu(app, menuItems){
	UiMode.call( this );
	var _this = this
	this.signals = {
		select : new signals.Signal()
	}

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
			position.y = -1.5 -Math.floor(index / maxWidth)*0.3
			position.z = -3

			app.camera.localToWorld(position)
			vrButton.object3d.position.copy(position)

			// make the menu facing the camera
			vrButton.object3d.lookAt(app.camera.position)
		})
	}

	app.gamepadSignals.signals.touchStart.add(onTouchStart)
	this.dispose = function(){
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

		// return now, if the intersected object if one of mine
		if( intersects.length > 0 && _this.getActionableObjects().indexOf( intersects[0].object ) === -1 ){
			return
		}

		vrButtons.forEach(function(vrButton){
			vrButton.itemBack.material.color.set('black')
		})

		if( intersects.length === 0 )	return

		var itemBack = intersects[0].object
		
		itemBack.material.color.set('cyan')
	}
	
	return

	function onTouchStart(buttonIndex){
		if( buttonIndex !== 0 )	return

		// return now, if there are no intersects
		if( intersects.length === 0 )	return

		var object3d = intersects[0].object
		// return now, if the intersect object isnt one of mine
		if( _this.getActionableObjects().indexOf( object3d ) === -1 )	return
		
		var itemKey = object3d.parent.userData.vrMenuItemKey
		console.log('just selected', itemKey)
		_this.signals.select.dispatch(itemKey)
	}
}

UiModeVrMenu.prototype = Object.create( UiMode.prototype );
UiModeVrMenu.prototype.constructor = UiModeVrMenu;
