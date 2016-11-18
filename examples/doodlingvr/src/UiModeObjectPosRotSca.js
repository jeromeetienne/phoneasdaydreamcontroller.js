function UiModeObjectPosRotSca(app, mode, planeType){
	var _this = this
	UiMode.call( this );

	this.signals = {
		completed : new signals.Signal()
	}

	var originPosition = app.selected.position.clone()
	var originScale = app.selected.scale.clone()
	var originQuaternion = app.selected.quaternion.clone()
	
	var originBoundingSphereRadius = app.selected.geometry.boundingSphere.radius * app.selected.scale.x

	// create the grid
	var grid = new THREE.GridHelper(2.5, 0.5);
	grid.geometry.applyMatrix( new THREE.Matrix4().makeRotationX(-Math.PI/2) )
	grid.position.copy( originPosition )
	scene.add( grid );
	// Create the projection plane
	var geometry = new THREE.PlaneBufferGeometry(5,5)
	var material = new THREE.MeshNormalMaterial({
		side : THREE.DoubleSide,
		visible : false,
	})
	var projectionPlane = new THREE.Mesh(geometry, material)
	grid.add( projectionPlane )

	// Rotate the grid to the proper projection plane
	if( planeType === 'planeXZ' ){
		grid.rotateX(-Math.PI/2)		
	}else if( planeType === 'planeXY' ){
		// nothin to do as it is the default
	}else if( planeType === 'planeYZ' ){
		grid.rotateY(Math.PI/2)		
	}else console.assert(false)

	// init signals
	app.gamepadSignals.signals.touchStart.add(onTouchStart)
	
	this.getActionableObjects = function(){
		return [projectionPlane]
	}
	this.update = function(){
		var intersects = app.intersects
		if( intersects.length === 0 )	return

		if( mode === 'translation'){
			var intersectPoint = intersects[0].point
			app.selected.position.copy(intersectPoint)			
		}else if( mode === 'rotation'){
			// var intersectPointWorld = intersects[0].point
			// var intersectPointLocal = grid.worldToLocal(intersectPointWorld.clone())
			// 
			// intersectPointLocal.normalize()
			// var centerPosition = new THREE.Vector(0,0,0)
			// var centerPosition = new THREE.Vector(1,0,0)
			
			var axis = projectionPlane.localToWorld(new THREE.Vector3(0,1,0))
			app.selected.quaternion.setFromAxisAngle(axis, Date.now()/1000)
		}else if( mode === 'scale'){
			var intersectPoint = intersects[0].point
			var distance = intersectPoint.distanceTo(app.selected.position)
			app.selected.scale.copy(originScale)
				.multiplyScalar(distance/originBoundingSphereRadius)
		}else console.assert(false)
	}

	this.dispose = function(){
		if( originPosition )	app.selected.position.copy(originPosition)
		if( originQuaternion )	app.selected.quaternion.copy(originQuaternion)
		if( originScale )	app.selected.scale.copy(originScale)

		app.gamepadSignals.signals.touchStart.remove(onTouchStart)

		scene.remove(grid)
	}

	
	return

	function onTouchStart(buttonIndex){
		if( buttonIndex !== 0 )	return
		originPosition = null
		originScale = null
		_this.signals.completed.dispatch()
	}
}

UiModeObjectPosRotSca.prototype = Object.create( UiMode.prototype );
UiModeObjectPosRotSca.prototype.constructor = UiModeObjectPosRotSca;
