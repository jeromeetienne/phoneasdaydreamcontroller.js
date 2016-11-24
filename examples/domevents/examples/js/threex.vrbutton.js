var THREEx = THREEx || {}

THREEx.VRButton = function(domEvents, label){
	var _this = this
	this.object3d = new THREE.Group
	
	var itemBack = _this._buildItemBack()
	_this.object3d.add(itemBack)
	
	var itemFront = _this._buildItemFront(label)
	_this.object3d.add(itemFront)

	domEvents.addEventListener(itemBack, 'mouseenter', function(event){
		itemBack.material.color.set('cyan')
	}, false)
	domEvents.addEventListener(itemBack, 'mouseleave', function(event){
		itemBack.material.color.set('black')
	}, false)
	domEvents.addEventListener(itemBack, 'mousedown', function(event){
		itemBack.material.color.set('pink')
	}, false)
	domEvents.addEventListener(itemBack, 'mouseup', function(event){
		itemBack.material.color.set('black')
	}, false)
	domEvents.addEventListener(itemBack, 'click', function(event){
		itemBack.material.color.set('cyan')
	}, false)
	
	this.dispose = function(){
		domEvents.remoteAllEventListeners(itemBack)
	}
}

/**
 * [_buildItemBack description]
 * @return {[type]} [description]
 */
THREEx.VRButton.prototype._buildItemBack = function() {
	// create texture
	var texture = THREEx.VRUiUtils.createCanvasTexture(256, 64)
	var canvas = texture.image
	var context = canvas.getContext('2d');

	// draw on texture
	context.fillStyle = 'rgba(127,127,127,1)';
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	// create mesh
	var material = new THREE.MeshBasicMaterial({
		map: texture,
		color: 'black',
		opacity: .5,
		transparent : true,
	})
	var geometry = new THREE.PlaneBufferGeometry( 2, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'itemBack'
	// return mesh
	return mesh
};

/**
 * [_buildItemObject3d description]
 * @param {[type]} itemKey   [description]
 * @param {[type]} itemValue [description]
 * @return {[type]} [description]
 */
THREEx.VRButton.prototype._buildItemFront = function (itemValue) {
	var texture = THREEx.VRUiUtils.createCanvasTexture(256, 64)
	var canvas = texture.image
	var context = canvas.getContext('2d');

	// draw borders
	context.font = '30pt Arial';
	context.fillStyle = '#fff';
	context.textBaseline = "middle";
	context.fillText(itemValue, canvas.width / 20, canvas.height / 2);

	// draw text
	context.strokeStyle = '#fff';
	context.lineWidth = 4
	context.strokeRect(0, 0, canvas.width, canvas.height);

	// build mesh
	var material = new THREE.MeshBasicMaterial({
		map: texture,
		transparent : true,
	})
	var geometry = new THREE.PlaneBufferGeometry( 2, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'itemFront'
	
	// return mesh
	return mesh
};
