var THREEx = THREEx || {}

THREEx.VROptionItem = function(domEvents, itemText){
	var _this = this
	this.object3d = new THREE.Group

	this.signals = {
		selected : new signals.Signal(),
	}
	
	this.dispose = function(){
		domEvents.remoteAllEventListeners(itemBack)
		domEvents.remoteAllEventListeners(itemButton)
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//          itemBack
	////////////////////////////////////////////////////////////////////////////////

	var itemBack = _this._buildItemBack()
	this._itemBack = itemBack
	_this.object3d.add(itemBack)
	
	////////////////////////////////////////////////////////////////////////////////
	//          itemFront
	////////////////////////////////////////////////////////////////////////////////
	

	var itemFront = _this._buildItemFront(itemText)
	this._itemFront = itemFront
	_this.object3d.add(itemFront)

	////////////////////////////////////////////////////////////////////////////////
	//          Code Separator
	////////////////////////////////////////////////////////////////////////////////
	
	var itemButton = _this._buildItemButton()
	this._itemButton = itemButton
	_this.object3d.add(itemButton)
}

/**
 * [_buildItemBack description]
 * @return {[type]} [description]
 */
THREEx.VROptionItem.prototype._buildItemButton = function() {
	var _this = this
	// create texture
	var texture = THREEx.VRUiUtils.createCanvasTexture(256, 64)
	var canvas = texture.image
	var context = canvas.getContext('2d');
	
        var image = new Image()
	image.addEventListener('load', function(){
		// console.log('arguments', arguments)
		context.drawImage(image, 0.75*canvas.width, 0.1*canvas.height, 0.2*canvas.width, 0.8*canvas.height);
		texture.needsUpdate = true
	})
        image.src = 'images/font-awesome_4-7-0_dot-circle-o_56_4_ffffff_none.png';

	// build the mesh
	var material = new THREE.MeshBasicMaterial({
		map: texture,
		color: 'white',
		opacity: 0,
		transparent : true,
	})
	var geometry = new THREE.PlaneBufferGeometry( 2, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'itemButton'

	////////////////////////////////////////////////////////////////////////////////
	//          bind events
	////////////////////////////////////////////////////////////////////////////////
	
	var tweenOpacity = null
	function startTweenOpacity(delay, targetValue){
		if( tweenOpacity !== null )	tweenOpacity.stop()
		tweenOpacity = new TWEEN.Tween({
			opacity : material.opacity
		}).to({
			opacity: targetValue
		}, 300)
		.delay(delay)
		.onUpdate(function(value) {
			material.opacity = this.opacity
    		}).start()		
	}
	domEvents.addEventListener(_this._itemBack, 'mouseenter', function(event){
		startTweenOpacity(300, 1)
	}, false)
	domEvents.addEventListener(_this._itemBack, 'mouseleave', function(event){
		startTweenOpacity(0, 0)
	}, false)

	return mesh
};


/**
 * [_buildItemBack description]
 * @return {[type]} [description]
 */
THREEx.VROptionItem.prototype._buildItemBack = function() {
	var _this = this
	// create texture
	var texture = THREEx.VRUiUtils.createCanvasTexture(256, 64)
	var canvas = texture.image
	var context = canvas.getContext('2d');
	// draw on texture
	context.fillStyle = 'rgba(127,127,127,1)';
	context.fillRect(0, 0, 1*canvas.width, 1*canvas.height);
	
	// build the mesh
	var material = new THREE.MeshBasicMaterial({
		map: texture,
		color: 'red',
		// color: 'black',
		opacity: .5,
		transparent : true,
	})
	var geometry = new THREE.PlaneGeometry( 2, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'itemBack'
window.geometry = geometry
	////////////////////////////////////////////////////////////////////////////////
	//          bind events
	////////////////////////////////////////////////////////////////////////////////
	
	// domEvents.addEventListener(mesh, 'mouseenter', function(event){
	// 	mesh.material.color.set('cyan')
	// }, false)
	// domEvents.addEventListener(mesh, 'mouseleave', function(event){
	// 	mesh.material.color.set('black')
	// }, false)	
	// domEvents.addEventListener(mesh, 'mousedown', function(event){
	// 	mesh.material.color.set('pink')
	// }, false)
	// domEvents.addEventListener(mesh, 'mouseup', function(event){
	// 	mesh.material.color.set('black')
	// }, false)
	// domEvents.addEventListener(mesh, 'click', function(event){
	// 	mesh.material.color.set('cyan')
	// }, false)
	
		
		////////////////////////////////////////////////////////////////////////////////
		//          Code Separator
		////////////////////////////////////////////////////////////////////////////////
		
		var tweenWidth = null
		function startTweenWidth(delay, srcValue, dstValue){
			if( tweenWidth !== null ){
				tweenWidth.stop()
				tweenWidth = null
			}
			tweenWidth = new TWEEN.Tween({
					width : srcValue,
				}).to({
					width : dstValue
				}, 300)
				.delay(delay)
				.onUpdate(function(value) {
					var geometry = _this._itemBack.geometry
					geometry.vertices[1].x = this.width
					geometry.vertices[3].x = this.width
					geometry.verticesNeedUpdate = true

					var geometry = _this._itemFront.geometry
					geometry.vertices[1].x = this.width
					geometry.vertices[3].x = this.width
					geometry.verticesNeedUpdate = true
				})
				.start()		
		}
		domEvents.addEventListener(mesh, 'mouseenter', function(event){
			startTweenWidth(0, geometry.vertices[1].x, 1.5)
		}, false)
		domEvents.addEventListener(mesh, 'mouseleave', function(event){
			startTweenWidth(300, geometry.vertices[1].x, 1.0)
		}, false)


	return mesh
};

/**
 * [_buildItemObject3d description]
 * @param {[type]} itemKey   [description]
 * @param {[type]} itemValue [description]
 * @return {[type]} [description]
 */
THREEx.VROptionItem.prototype._buildItemFront = function (itemValue) {
	// create texture
	var texture = THREEx.VRUiUtils.createCanvasTexture(256, 64)
	var canvas = texture.image
	var context = canvas.getContext('2d');

	// draw on texture
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
	mesh.name = 'itemFront'

	// return mesh
	return mesh
};
