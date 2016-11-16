var THREEx = THREEx || {}

THREEx.VRMenu = function(items){
	var _this = this
	this.object3d = new THREE.Group
	

	Object.keys(items).forEach(function(itemKey, index){
		var itemValue = items[itemKey]
		var itemFront = _this._buildItemFront(itemKey, itemValue)
		itemFront.position.y = - index * itemFront.geometry.parameters.height

		var itemBack = _this._buildItemBack(itemKey)
		itemFront.add(itemBack)

		_this.object3d.add(itemFront)
	})
}

/**
 * [_buildItemBack description]
 * @return {[type]} [description]
 */
THREEx.VRMenu.prototype._buildItemBack = function (itemKey) {
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
	})
	var geometry = new THREE.PlaneBufferGeometry( 2, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'itemBack'
	mesh.position.z += -.1
	mesh.userData.vrMenuItemKey = itemKey

	return mesh
};

/**
 * [_buildItemObject3d description]
 * @param {[type]} itemKey   [description]
 * @param {[type]} itemValue [description]
 * @return {[type]} [description]
 */
THREEx.VRMenu.prototype._buildItemFront = function (itemKey, itemValue) {
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
	})
	var geometry = new THREE.PlaneBufferGeometry( 2, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'itemFront'
	mesh.userData.vrMenuItemKey = itemKey

	return mesh
};
