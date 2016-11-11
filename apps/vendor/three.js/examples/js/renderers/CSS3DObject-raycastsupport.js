THREE.CSS3DObject.prototype.raycast = ( function () {

	var inverseMatrix = new THREE.Matrix4();
	var ray = new THREE.Ray();
	var intersectionPoint = new THREE.Vector3();
	var intersectionPointWorld = new THREE.Vector3();
	var pointA = new THREE.Vector3()
	var pointB = new THREE.Vector3()
	var pointC = new THREE.Vector3()
	var pointD = new THREE.Vector3()

	return function raycast( raycaster, intersects ) {

		//////////////////////////////////////////////////////////////////////////////
		//              Get the size of the DOMElement
		//////////////////////////////////////////////////////////////////////////////
		
                var computedStyle = window.getComputedStyle(this.element || this.elementL);
                var width = parseInt(computedStyle.width);
                var height = parseInt(computedStyle.height);
		
		pointA.set(-width/2, +height/2, 0)
		pointB.set(+width/2, +height/2, 0)
		pointC.set(+width/2, -height/2, 0)
		pointD.set(-width/2, -height/2, 0)

		// move ray in object space
		inverseMatrix.getInverse( this.matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		// check intersection with both triangle 'face' of this dom element
		var intersect = ray.intersectTriangle( pointA, pointB, pointC, false, intersectionPoint );
		if( intersect === null ){
			intersect = ray.intersectTriangle( pointA, pointC, pointD, false, intersectionPoint );
		}

		if( intersect === null )	return null

		// compute distance from ray origin to intersection point
		intersectionPointWorld.copy( intersectionPoint );
		intersectionPointWorld.applyMatrix4( this.matrixWorld );
		var distance = raycaster.ray.origin.distanceTo( intersectionPointWorld );

		// check distance range
		if ( distance < raycaster.near || distance > raycaster.far ) return null;

		// return info about intersection
		var intersection  = {
			distance: distance,
			point: intersectionPointWorld.clone(),
			object: this
		};

		intersects.push( intersection );
	};

}() );