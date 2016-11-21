var THREEx = THREEx || {}


THREEx.DaydreamController = function(){
	var _this = this
	this.object3d = new THREE.Group

	this._initRayModel()	
}

/**
 * [_initRayModel description]
 * @return {[type]} [description]
 */
THREEx.DaydreamController.prototype._initRayModel = function () {
	// Create 3D objects.
	var geometry = new THREE.BoxGeometry(0.5*0.2, 0.1*0.2, 1*0.2);
	var material = new THREE.MeshNormalMaterial();
	var phoneModel = new THREE.Mesh(geometry, material);
	this._phoneModel = phoneModel
	
	var laserBeam	= new THREEx.LaserBeam()
	laserBeam.object3d.rotation.y = Math.PI/2
	laserBeam.object3d.scale.x = 0.5
	laserBeam.object3d.scale.z = 0.5
	laserBeam.object3d.position.z = -0.5*0.2
	this._laserBeam = laserBeam
	
	this._laserCooked	= new THREEx.LaserCooked(laserBeam)
	
	phoneModel.add(laserBeam.object3d)
	this.object3d.add(phoneModel)
};

/**
 * [updatePosition description]
 * @param {[type]} camera  [description]
 * @param {[type]} gamepad [description]
 * @return {[type]} [description]
 */
THREEx.DaydreamController.prototype.updatePosition = function(camera, gamepad){
	var _this = this
	
	var object3d = _this.object3d

	// compute quaternion from gamepad.pose.orientation
	var controllerQuaternion = new THREE.Quaternion().fromArray(gamepad.pose.orientation)
	object3d.quaternion.copy(controllerQuaternion)

	// set position according to gamepad.hand
	if( gamepad.hand === 'right' ){
		var position = new THREE.Vector3(+0.5,-0.5, -1)
	}else if( gamepad.hand === 'left' ){
		var position = new THREE.Vector3(-0.5,-0.5, -1)
	}else {
		var position = new THREE.Vector3(0.0,-0.5, -1)
	}
	// set position in world space
	camera.updateMatrixWorld(true)
	camera.localToWorld(position)
	object3d.position.copy(position)
}


/**
 * [updatePosition description]
 * @param {[type]} camera  [description]
 * @param {[type]} gamepad [description]
 * @return {[type]} [description]
 */
THREEx.DaydreamController.prototype.getRaycaster = function(){
	var _this = this

	var object3d = this._laserBeam.object3d
	var raycaster	= new THREE.Raycaster()

	// get laserBeam matrixWorld
	object3d.updateMatrixWorld();
	var matrixWorld	= object3d.matrixWorld.clone()
	// set the origin
	raycaster.ray.origin.setFromMatrixPosition(matrixWorld)
	// keep only the roation
	matrixWorld.setPosition(new THREE.Vector3(0,0,0))		
	// set the direction
	// TODO use instead .setFromRotationMatrix ???
	raycaster.ray.direction.set(1,0,0)
		.applyMatrix4( matrixWorld )
		.normalize()
		
	return raycaster
		
}
