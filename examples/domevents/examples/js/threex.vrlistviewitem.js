var THREEx = THREEx || {}

THREEx.VRListviewItem = function(domEvents, options){
	var _this = this
	this.object3d = new THREE.Group

	this.signals = {
		selectedPrimaryAction : new signals.Signal(),
		selectedSecondaryAction : new signals.Signal(),
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
	

	var itemFront = _this._buildItemFront(options.label, options.iconUrl)
	this._itemFront = itemFront
	_this.object3d.add(itemFront)

	////////////////////////////////////////////////////////////////////////////////
	//          Code Separator
	////////////////////////////////////////////////////////////////////////////////
	if( options.actionRight ){
		this._itemButtonRight = _this._buildItemButton(options.actionRight)
		this._itemButtonRight.position.x = +(1.5 - 0.5/2);
		// FIXME here if we attach to _this.object3d, mouseenter/mouseleave fails
		itemBack.add(this._itemButtonRight)		
	}

	if( options.actionLeft ){
		this._itemButtonLeft = _this._buildItemButton(options.actionLeft)
		this._itemButtonLeft.position.x = -(1.5 - 0.5/2);
		// FIXME here if we attach to _this.object3d, mouseenter/mouseleave fails
		itemBack.add(this._itemButtonLeft)		
	}
}

/**
 * [_buildItemBack description]
 * @return {[type]} [description]
 */
THREEx.VRListviewItem.prototype._buildItemButton = function(action) {
	var _this = this
	// create texture
	var texture = THREEx.VRUiUtils.createCanvasTexture(64, 64)
	var canvas = texture.image
	var context = canvas.getContext('2d');
	
        var image = new Image()
	image.addEventListener('load', function(){
		// console.log('arguments', arguments)
		context.drawImage(image, 0.1*canvas.width, 0.1*canvas.height, 0.8*canvas.width, 0.8*canvas.height);
		texture.needsUpdate = true
	})
        image.src = action.url;

	// build the mesh
	var material = new THREE.MeshBasicMaterial({
		map: texture,
		color: 'white',
		opacity: 0,
		transparent : true,
	})
	var geometry = new THREE.PlaneGeometry( 0.5, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'itemButton'

	//////////////////////////////////////////////////////////////////////////////
	//		Code Separator
	//////////////////////////////////////////////////////////////////////////////

	domEvents.addEventListener(mesh, 'click', function(event){
		if( action.onClick === undefined )	return
		action.onClick(event)
	}, false)

	
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
		}, 200)
		.delay(delay)
		.onUpdate(function(value) {
			material.opacity = this.opacity
    		}).start()		
	}
	domEvents.addEventListener(_this._itemBack, 'mouseenter', function(event){
// console.log(event.type, 'button opacity')
		startTweenOpacity(200, 1)
	}, false)
	domEvents.addEventListener(_this._itemBack, 'mouseleave', function(event){
// console.log(event.type, 'button opacity')
		startTweenOpacity(0, 0)
	}, false)

	return mesh
};


/**
 * [_buildItemBack description]
 * @return {[type]} [description]
 */
THREEx.VRListviewItem.prototype._buildItemBack = function() {
	var _this = this
	// create texture
	var texture = THREEx.VRUiUtils.createCanvasTexture(256, 64)
	var canvas = texture.image
	var context = canvas.getContext('2d');
	// draw on texture
	context.fillStyle = 'rgba(127,127,127,0.2)';
	context.fillRect(0, 0, 1*canvas.width, 1*canvas.height);
	
	context.strokeStyle = '#fff';
	context.lineWidth = 4
	context.strokeRect(0, 0, canvas.width, canvas.height);

	// build the mesh
	var material = new THREE.MeshBasicMaterial({
		map: texture,
		opacity: .5,
		transparent : true,
	})
	var geometry = new THREE.PlaneGeometry( 2, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'itemBack'
	
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
			}, 200)
			.delay(delay)
			.onUpdate(function(value) {
				var geometry = _this._itemBack.geometry
				if( _this._itemButtonRight ){
					geometry.vertices[1].x = this.width
					geometry.vertices[3].x = this.width					
				}
				if( _this._itemButtonLeft ){
					geometry.vertices[0].x = -this.width
					geometry.vertices[2].x = -this.width					
				}
				geometry.verticesNeedUpdate = true
				geometry.computeBoundingSphere()
			})
			.start()
	}
	domEvents.addEventListener(mesh, 'mouseenter', function(event){
// console.log(event.type, 'item width')
		if( _this._itemButtonRight )	var currentWidth = geometry.vertices[1].x
		else if( _this._itemButtonLeft)	var currentWidth = -geometry.vertices[0].x
		else return
		startTweenWidth(0, currentWidth, 1.5)
	}, false)
	domEvents.addEventListener(mesh, 'mouseleave', function(event){
// console.log(event.type, 'item width')
		if( _this._itemButtonRight )	var currentWidth = geometry.vertices[1].x
		else if( _this._itemButtonLeft)	var currentWidth = -geometry.vertices[0].x
		else return
		startTweenWidth(200, currentWidth, 1.0)
	}, false)


	return mesh
};

/**
 * [_buildItemObject3d description]
 * @param {[type]} itemKey   [description]
 * @param {[type]} itemValue [description]
 * @return {[type]} [description]
 */
THREEx.VRListviewItem.prototype._buildItemFront = function (itemValue, iconUrl) {
	// create texture
	var texture = THREEx.VRUiUtils.createCanvasTexture(256, 64)
	var canvas = texture.image
	var context = canvas.getContext('2d');


	// draw iconUrl on texture
	if( iconUrl ){
		var image = new Image()
		image.addEventListener('load', function(){
			// console.log('arguments', arguments)
			context.drawImage(image, 0.0*canvas.width, 0.0*canvas.height, 1*canvas.height, 1*canvas.height);
			texture.needsUpdate = true
		})
	        image.src = iconUrl;
	}
	// draw label on texture
	context.font = '30pt Arial';
	context.fillStyle = '#fff';
	context.textBaseline = "middle";
	if( iconUrl ){
		context.fillText(itemValue, 5/20*canvas.width, canvas.height / 2);
	}else{
		context.fillText(itemValue, 1/20*canvas.width, canvas.height / 2);
		
	}

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
