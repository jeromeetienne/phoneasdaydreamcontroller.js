var THREEx = THREEx || {}


THREEx.DaydreamController = function(){
	var _this = this
	this.object3d = new THREE.Group

	this._initRayModel()	
	this._initArmModel()	

	// handle originCamera for onDeviceOrientationReset
	this._originCameraQuaternion = null
}

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////
THREEx.DaydreamController.prototype._initArmModel = function (){
	this.armModel = new OrientationArmModel();

	// Create a cylindrical ray
	function base64(mimeType, base64) {
		return 'data:' + mimeType + ';base64,' + base64;
	}
	const RAY_RADIUS = 0.02;
	const GRADIENT_IMAGE = base64('image/png', 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAABdklEQVR4nO3WwXHEQAwDQcin/FOWw+BjuiPYB2q4G2nP933P9SO4824zgDADiDOAuHfb3/UjuKMAcQYQZwBx/gBxChCnAHEKEKcAcQoQpwBxChCnAHEGEGcAcf4AcQoQZwBxBhBnAHEGEGcAcQYQZwBxBhBnAHEGEGcAcQYQZwBxBhBnAHHvtt/1I7ijAHEGEGcAcf4AcQoQZwBxTkCcAsQZQJwTEKcAcQoQpwBxBhDnBMQpQJwCxClAnALEKUCcAsQpQJwCxClAnALEKUCcAsQpQJwBxDkBcQoQpwBxChCnAHEKEKcAcQoQpwBxChCnAHEKEGcAcU5AnALEKUCcAsQZQJwTEKcAcQYQ5wTEKUCcAcQZQJw/QJwCxBlAnAHEGUCcAcQZQJwBxBlAnAHEGUCcAcQZQJwBxBlAnAHEGUDcu+25fgR3FCDOAOIMIM4fIE4B4hQgTgHiFCBOAeIUIE4B4hQgzgDiDCDOHyBOAeIMIM4A4v4B/5IF9eD6QxgAAAAASUVORK5CYII=');
	var geometry = new THREE.CylinderGeometry(RAY_RADIUS, RAY_RADIUS, 1, 32);
	var material = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture(GRADIENT_IMAGE),
		//color: 0xffffff,
		transparent: true,
		opacity: 0.3
	});
	var mesh = new THREE.Mesh(geometry, material);
	this.armMesh = mesh
	
	scene.add(mesh)
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
	gamepad.onDeviceOrientationReset = function(){
		_this._originCameraQuaternion = null
	}

	// handle originCamera for onDeviceOrientationReset
	if(_this._originCameraQuaternion === null){
		_this._originCameraQuaternion = camera.quaternion.clone()
	}
	
	
	var object3d = _this.object3d

	// compute quaternion from gamepad.pose.orientation
	var controllerQuaternion = new THREE.Quaternion().fromArray(gamepad.pose.orientation)
	var poseQuaternion = _this._originCameraQuaternion.clone().multiply( controllerQuaternion )
	object3d.quaternion.copy(poseQuaternion)

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
	
	
	// this.armModel.setHeadOrientation(camera.quaternion);
        // this.armModel.setHeadPosition(camera.position);
        // this.armModel.setControllerOrientation(poseQuaternion);
        // this.armModel.update();
	// 
        // var modelPose = this.armModel.getPose();
	// modelPose.position.y += 0.5
        // this.armMesh.position.copy(modelPose.position);
        // this.armMesh.quaternion.copy(modelPose.orientation);
	// // this.armMesh.rotateX(Math.PI/2)
	// // this.armMesh.rotateZ(Math.PI)
	// window.armMesh = this.armMesh	
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
