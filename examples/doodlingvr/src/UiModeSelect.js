function UiModeSelect(app){
	UiMode.call( this );

	var _this = this
	this.signals = {
		select : new signals.Signal()
	}

	this._intersects = []

	this.getActionableObjects = function(){
		var objects = []
		scene.traverse(function(object3d){
			if( object3d.geometry instanceof THREE.TorusGeometry === false)	return
			objects.push(object3d)
		})
		return objects
	}
	
	app.gamepadSignals.signals.touchStart.add(onTouchStart)
	this.dispose = function(){
		app.gamepadSignals.signals.touchStart.remove(onTouchStart)
	}
	
	this.update = function(app){
		this._intersects	= app.intersects
	}
	return
	
	function onTouchStart(buttonIndex){
		if( buttonIndex !== 0 )	return
		
		var intersects = _this._intersects
		// return now, if the intersected object if one of mine
		if( intersects.length > 0 && _this.getActionableObjects().indexOf( intersects[0].object ) === -1 ){
			return
		}

		if( _this._intersects.length > 0 ){
			var object3d = intersects[0].object
			_this.signals.select.dispatch(object3d)
		}else{
			_this.signals.select.dispatch(null)
		}
	}

}


UiModeSelect.prototype = Object.create( UiMode.prototype );
UiModeSelect.prototype.constructor = UiModeSelect;
