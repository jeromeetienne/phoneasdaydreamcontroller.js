function UiModeObjectTranslation(app, mode, planeType){
	var _this = this
	UiMode.call( this );
	
	this.signals = {
		completed : new signals.Signal()
	}

	if( mode === 'translation' ){
		var originPosition = app.selected.position.clone()
	}else if( mode === 'scale' ){
		var originScale = app.selected.scale.clone()		
	}else console.assert(false)

	var grid = new THREE.GridHelper(2.5, 0.5);
	grid.geometry.applyMatrix( new THREE.Matrix4().makeRotationX(-Math.PI/2) )
	grid.position.copy( originPosition )
	scene.add( grid );

	if( planeType === 'planeXZ' ){
		grid.rotateX(-Math.PI/2)		
	}else if( planeType === 'planeXY' ){
		// nothin to do as it is the default
	}else if( planeType === 'planeYZ' ){
		grid.rotateY(Math.PI/2)		
	}else console.assert(false)

	var geometry = new THREE.PlaneBufferGeometry(5,5)
	var material = new THREE.MeshNormalMaterial({
		side : THREE.DoubleSide,
		visible : false,
	})
	var projectionPlane = new THREE.Mesh(geometry, material)
	grid.add( projectionPlane )

	app.gamepadSignals.signals.touchStart.add(onTouchStart)
	
	this.getActionableObjects = function(){
		return [projectionPlane]
	}
	this.update = function(){
		var intersects = app.intersects
		if( intersects.length === 0 )	return

		var position = intersects[0].point
		app.selected.position.copy(position)
	}
	this.dispose = function(){
		if( originPosition )	app.selected.position.copy(originPosition)
		if( originScale )	app.selected.scale.copy(originScale)

		app.gamepadSignals.signals.touchStart.remove(onTouchStart)

		scene.remove(grid)
		// scene.remove( projectionPlane )
	}

	
	return

	function onTouchStart(buttonIndex){
		if( buttonIndex !== 0 )	return
		originPosition = null
		_this.signals.completed.dispatch()
	}
}

UiModeObjectTranslation.prototype = Object.create( UiMode.prototype );
UiModeObjectTranslation.prototype.constructor = UiModeObjectTranslation;
