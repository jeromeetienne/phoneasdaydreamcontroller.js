function UiModeVrMenu(app){
	UiMode.call( this );
	var _this = this
	this.signals = {
		select : new signals.Signal()
	}
	

	var vrMenu = new THREEx.VRMenu({
		'select' : 'Select',
		'controllerOrientation' : 'Controller Orientation',
		'objectTranslation' : 'Translate',
	})
	scene.add(vrMenu.object3d)
	
	if( app.selected === null ){
		vrMenu.object3d.position.z = -4
	}else{
		vrMenu.object3d.position.copy(app.selected.position)
		vrMenu.object3d.position.y += 0.5
	}
	vrMenu.object3d.scale.multiplyScalar(1/2)

	app.gamepadSignals.signals.touchStart.add(onTouchStart)
	this.dispose = function(){
		app.gamepadSignals.signals.touchStart.remove(onTouchStart)
		scene.remove(vrMenu.object3d)
	}


	this.getActionableObjects = function(){
		var itemsBack = []
		vrMenu.object3d.traverse(function(object3d){
			if( object3d.name !== 'itemBack' ) return
			itemsBack.push(object3d)
		})
		return itemsBack
	}

	var intersects = []
	this.update = function(){
		intersects	= app.intersects

		_this.getActionableObjects().forEach(function(itemBack){
			itemBack.material.color.set('black')
		})

		if( intersects.length === 0 )	return
		var itemBack = intersects[0].object
		itemBack.material.color.set('cyan')
	}
	
	return

	function onTouchStart(buttonIndex){
		if( buttonIndex !== 0 )	return
		if( intersects.length === 0 )	return
		var object3d = intersects[0].object
		
		var itemKey = object3d.userData.vrMenuItemKey
		console.log('just selected', itemKey)
		_this.signals.select.dispatch(itemKey)
	}
}

UiModeVrMenu.prototype = Object.create( UiMode.prototype );
UiModeVrMenu.prototype.constructor = UiModeVrMenu;
