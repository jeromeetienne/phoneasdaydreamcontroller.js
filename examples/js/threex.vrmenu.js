var THREEx = THREEx || {}

THREEx.VRMenu = function(domEvents, items, onSelect){
	var _this = this
	this.object3d = new THREE.Group

	Object.keys(items).forEach(function(itemKey, index){
		var itemValue = items[itemKey]
		var object3d = _this._buildItemObject3d(itemKey, itemValue)
		object3d.position.y = - index * object3d.geometry.parameters.height

		var cache = _this._buildItemCache()
		object3d.add(cache)
		
		domEvents.addEventListener(cache, 'click', function(event){
			console.log('you clicked on mesh', itemKey)
			onSelect && onSelect(itemKey)
		}, false)		

		_this.object3d.add(object3d)
	})
}

/**
 * [_buildItemCache description]
 * @return {[type]} [description]
 */
THREEx.VRMenu.prototype._buildItemCache = function () {
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
	var geometry = new THREE.PlaneGeometry( 2, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.z += -.1

	return mesh
};

/**
 * [_buildItemObject3d description]
 * @param {[type]} itemKey   [description]
 * @param {[type]} itemValue [description]
 * @return {[type]} [description]
 */
THREEx.VRMenu.prototype._buildItemObject3d = function (itemKey, itemValue) {
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
	var geometry = new THREE.PlaneGeometry( 2, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );

	return mesh
};
