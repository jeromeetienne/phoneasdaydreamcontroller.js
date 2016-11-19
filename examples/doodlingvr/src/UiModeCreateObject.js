function UiModeCreateObject(app){
	UiMode.call( this );

	var _this = this
	var timerId = null
	this.signals = {
		completed : new signals.Signal()
	}
	
	var geometry = new THREE.TorusGeometry(0.5-0.15, 0.15);
	var material	= new THREE.MeshPhongMaterial({
		color	: 0xffffff,
		specular: 0xffffff,
		shininess: 200,
	});
	var object3d	= new THREE.Mesh( geometry, material );
	object3d.position.z = -3
	scene.add(object3d)
	
	
	if( timerId !== null )	return
	timerId = setTimeout(function(){
		timerId = null;
		_this.signals.completed.dispatch()
	}, 0)

	this.dispose = function(){
		if( timerId === null )	return
		clearTimeout(timerId)
		timerId = null
	}
	
	return
}


UiModeCreateObject.prototype = Object.create( UiMode.prototype );
UiModeCreateObject.prototype.constructor = UiModeCreateObject;
