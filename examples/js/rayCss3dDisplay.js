// put this in its own
function RayCSS3D(){
	var _this = this
	
	this.object3d = new THREE.Group
			
	//////////////////////////////////////////////////////////////////////////////
	//		build the ray display
	//////////////////////////////////////////////////////////////////////////////
	var div1 = document.createElement( 'div1' );
	div1.style.width = '10px';
	div1.style.height = '480px';
	div1.style.backgroundColor = 'lightblue';
	div1.style.pointerEvents = 'none'
	
	var object1 = new THREE.CSS3DObject( div1 );
	object1.rotation.y = Math.PI/2

	var div2 = document.createElement( 'div2' );
	div2.style.width = '10px';
	div2.style.height = '480px';
	div2.style.backgroundColor = 'lightblue';
	div2.style.pointerEvents = 'none'
	
	var object2 = new THREE.CSS3DObject( div2 );
	object2.position.z = -240
	object2.rotation.x = -Math.PI/2

	object2.add(object1)
	this.object3d.add(object2);

	/**
	 * set the orientation of this ray
	 */
	this.setOrientation = function(quaternion){
		_this.object3d.quaternion.copy(quaternion)		
	}
	
	var raycaster	= new THREE.Raycaster()
	this.update = function(){
		var object = _this.object3d
		// get laserBeam matrixWorld
		object.updateMatrixWorld();
		var matrixWorld	= object.matrixWorld.clone()
		// set the origin
		raycaster.ray.origin.setFromMatrixPosition(matrixWorld)
		// keep only the roation
		matrixWorld.setPosition(new THREE.Vector3(0,0,0))		
		// set the direction
		raycaster.ray.direction.set(0,0,-1)
			.applyMatrix4( matrixWorld )
			.normalize()
	
		// remote any .hovering 
		var domElements = document.querySelectorAll('.hovering')
		for(var i = 0; i < domElements.length; i++){
			domElements[i].classList.remove('hovering')
		}
		
		var intersects		= raycaster.intersectObjects( scene.children );
		if( intersects.length === 0 ){
			// set default length
			updateLength(500)
			return
		}

		var intersect = intersects[0]
		// update ray length
		updateLength(intersect.distance)
		
		// console.log(intersect.point)
		
		var projector	= new THREE.Projector();
		var screenPos	= intersect.point.project( camera );
		screenPos.x = (screenPos.x/2 + 0.5) * window.innerWidth
		screenPos.y = (1 - (screenPos.y/2 + 0.5)) * window.innerHeight
		screenPos.x = Math.round(screenPos.x)
		screenPos.y = Math.round(screenPos.y)
		
		var elementFromPoint = document.elementFromPoint(screenPos.x, screenPos.y)
		
		if( elementFromPoint.dataset.hoverable ){
			// console.log('elementFromPoint', elementFromPoint)
			elementFromPoint.classList.add('hovering')
		}
		
	}
	
	return

	/**
	 * update the length of the ray
	 */
	function updateLength(length){
		div1.style.height = length + 'px'
		div2.style.height = length + 'px'
		object2.position.z = -length/2
	}	
}
