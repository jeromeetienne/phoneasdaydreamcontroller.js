function UiModeDelete(app){
	UiMode.call( this );

	var _this = this
	var timerId = null
	this.signals = {
		completed : new signals.Signal()
	}
	
	if( app.selected.parent ) app.selected.parent.remove(app.selected)

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


UiModeDelete.prototype = Object.create( UiMode.prototype );
UiModeDelete.prototype.constructor = UiModeDelete;
