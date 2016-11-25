var THREEx = THREEx || {}

THREEx.VRPanelHeader = function(domEvents, options){
	var _this = this
	this.object3d = new THREE.Group
	this._domEvents = domEvents
	
	this.signals = {
		clickRightAction : new signals.Signal,
		clickLeftAction : new signals.Signal,
	}
	
	this.dispose = function(){
		domEvents.remoteAllEventListeners(_this._buttonRight)
		domEvents.remoteAllEventListeners(_this._buttonLeft)
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//          itemBack
	////////////////////////////////////////////////////////////////////////////////

	var objectBackground = _this._buildBackground('Super header')
	_this.object3d.add(objectBackground)
	
	////////////////////////////////////////////////////////////////////////////////
	//          Code Separator
	////////////////////////////////////////////////////////////////////////////////

	if( options.actionRight ){
		this._buttonRight = _this._buildButton(options.actionRight.url)
		this._buttonRight.position.x = +(1.5 - 0.5/2);
		_this.object3d.add(this._buttonRight)
		domEvents.addEventListener(this._buttonRight, 'click', function(){
			_this.signals.clickRightAction.dispatch()
		})
	}
	
	if( options.actionLeft ){
		this._buttonLeft = _this._buildButton(options.actionLeft.url)
		this._buttonLeft.position.x = -(1.5 - 0.5/2);
		_this.object3d.add(this._buttonLeft)		
		domEvents.addEventListener(this._buttonLeft, 'click', function(){
			_this.signals.clickLeftAction.dispatch()
		})
	}
}

/**
 * [_buildItemObject3d description]
 * @param {[type]} itemKey   [description]
 * @param {[type]} itemValue [description]
 * @return {[type]} [description]
 */
THREEx.VRPanelHeader.prototype._buildBackground = function (panelTitle) {
	// create texture
	var texture = THREEx.VRUiUtils.createCanvasTexture(256, 64)
	var canvas = texture.image
	var context = canvas.getContext('2d');

	// draw on texture
	context.save()

	var gradient = context.createLinearGradient(0,0,0, 64)
	gradient.addColorStop(0,"#555");
	gradient.addColorStop(1,"#222");

	context.fillStyle = gradient;
	context.fillRect(0, 0, 1*canvas.width, 1*canvas.height);

	// draw label on texture
	context.font = '10pt Arial';
	context.fillStyle = '#fff';
	context.textBaseline = "middle";
	context.fillText(panelTitle, 1/5*canvas.width, canvas.height / 2);

	context.restore()

	var material = new THREE.MeshBasicMaterial({
		map: texture,
		transparent : true,
	})
	var geometry = new THREE.PlaneGeometry( 3, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.name = 'background'

	// return mesh
	return mesh
};


/**
 * [_buildItemBack description]
 * @return {[type]} [description]
 */
THREEx.VRPanelHeader.prototype._buildButton = function(imageUrl) {
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
        image.src = imageUrl;

	// build the mesh
	var material = new THREE.MeshBasicMaterial({
		map: texture,
		transparent : true,
	})
	var geometry = new THREE.PlaneGeometry( 0.5, 0.5 );
	var mesh = new THREE.Mesh( geometry, material );

	return mesh
};
