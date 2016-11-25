var THREEx = THREEx || {}

THREEx.VRListview = function(domEvents, options){
	var _this = this
	this.object3d = new THREE.Group

	this.dispose = function(){
		panelHeader.dispose()
		vrListviewItems.dispose()
	}
	
	////////////////////////////////////////////////////////////////////////////////
	//          Code Separator
	////////////////////////////////////////////////////////////////////////////////

	var contentBackground = _this._buildContentBackground()
	this._contentBackground = contentBackground
	_this.object3d.add(contentBackground)

	////////////////////////////////////////////////////////////////////////////////
	//          build header
	////////////////////////////////////////////////////////////////////////////////
	
	var panelHeader = new THREEx.VRPanelHeader(domEvents, {
		title : options.headerLabel,
		actionRight : options.headerActionRight,
		actionLeft : options.headerActionLeft,
	})
	_this.object3d.add( panelHeader.object3d )
	panelHeader.signals.clickRightAction.add(function(){
		console.log('click header right action')
	})
	panelHeader.signals.clickLeftAction.add(function(){
		console.log('click header left action')
	})
	
	
	////////////////////////////////////////////////////////////////////////////////
	//          build content
	////////////////////////////////////////////////////////////////////////////////
	var vrListviewItems = new THREEx.VRListviewItems(domEvents, {
		items : options.items,
		actionRight : options.itemActionRight,
		actionLeft : options.itemActionLeft,
	})
	vrListviewItems.object3d.position.set(0,-0.5,0)
	_this.object3d.add( vrListviewItems.object3d )
}

/**
 * [_buildItemBack description]
 * @return {[type]} [description]
 */
THREEx.VRListview.prototype._buildContentBackground = function() {
	var _this = this
	// create texture
	var texture = THREEx.VRUiUtils.createCanvasTexture(256, 256)
	var canvas = texture.image
	var context = canvas.getContext('2d');
	// draw on texture
	context.save()
	context.fillStyle = 'rgba(32,32,32,0.2)';
	context.fillRect(0, 0, 1*canvas.width, 1*canvas.height);
	context.restore()

	// build the mesh
	var material = new THREE.MeshBasicMaterial({
		map: texture,
		opacity: .5,
		transparent : true,
	})
	var geometry = new THREE.PlaneGeometry( 3, 7 * 0.5);
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.y += - geometry.parameters.height/2 - 0.25
	
	// return the mesh
	return mesh
};
