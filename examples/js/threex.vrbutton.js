var THREEx = THREEx || {}

THREEx.VRButton = function(label){
	var _this = this
	this.object3d = new THREE.Group
	
	var itemFront = _this._buildItemFront(label)
	_this.object3d.add(itemFront)

	var itemBack = _this._buildItemBack()
	_this.object3d.add(itemBack)
	
	this.itemBack = itemBack
}

/**
 * [_buildItemBack description]
 * @return {[type]} [description]
 */
THREEx.VRButton.prototype._buildItemBack = function() {
	var canvas = document.createElement('canvas')
	canvas.width = 256
	canvas.height = 64;
	var context = canvas.getContext('2d');

	context.fillStyle = 'rgba(127,127,127,1)';
	context.fillRect(0, 0, canvas.width, canvas.height);
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true
	
	var material = new THREE.MeshBasicMaterial({
		map: texture,
		color: 'black',
		opacity: .5,
		transparent : true,
		depthTest : false
	})
	var geometry = new THREE.PlaneBufferGeometry( 2, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'itemBack'
	mesh.position.z += -.1

	return mesh
};

/**
 * [_buildItemObject3d description]
 * @param {[type]} itemKey   [description]
 * @param {[type]} itemValue [description]
 * @return {[type]} [description]
 */
THREEx.VRButton.prototype._buildItemFront = function (itemValue) {
	var canvas = document.createElement('canvas')
	canvas.width = 256
	canvas.height = 64;
	var context = canvas.getContext('2d');

	context.font = '30pt Arial';
	context.fillStyle = '#fff';
	context.textBaseline = "middle";
	context.fillText(itemValue, canvas.width / 20, canvas.height / 2);

	context.strokeStyle = '#fff';
	context.lineWidth = 4
	context.strokeRect(0, 0, canvas.width, canvas.height);
	
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true

	var material = new THREE.MeshBasicMaterial({
		map: texture,
		transparent : true,
		depthTest : false
	})
	var geometry = new THREE.PlaneBufferGeometry( 2, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'itemFront'
	return mesh
};
