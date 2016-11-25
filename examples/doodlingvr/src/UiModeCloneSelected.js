function UiModeCloneSelected(app){
	UiMode.call( this );

	var _this = this
	var timerId = null
	this.signals = {
		completed : new signals.Signal()
	}
	
	// do the operation
	var clone = app.selected.clone();
	clone.material = clone.material.clone()
	clone.position.x += clone.geometry.boundingSphere.radius
	scene.add( clone )
	
	

	// notify caller on next iteration
	if( timerId !== null )	return
	timerId = setTimeout(function(){
		timerId = null;
		_this.signals.completed.dispatch(clone)
	}, 0)

	this.dispose = function(){
		if( timerId === null )	return
		clearTimeout(timerId)
		timerId = null
	}
	
	return
}


UiModeCloneSelected.prototype = Object.create( UiMode.prototype );
UiModeCloneSelected.prototype.constructor = UiModeCloneSelected;
