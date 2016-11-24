var THREEx = THREEx || {}


THREEx.DomEvents = function(){
	this._objects = []
}


THREEx.DomEvents.prototype.remoteAllEventListeners = function (object) {
	delete object.userData.listeners	
	
	var index = this._objects.indexOf(object)
	if (index !== -1 ) this._objects.splice(index, 1);
}

THREEx.DomEvents.prototype.addEventListener = function (object, eventType, callback, useCapture) {

	// object listen on eventType
	object.userData.listeners = object.userData.listeners || {
		'mousedown' : [],
		'mouseup' : [],
	}

	console.assert(object.userData.listeners[eventType] !== undefined)
	
	var listener = {
		callback : callback,
		useCapture : useCapture
	}
	object.userData.listeners[eventType].push(listener)

	// if it isnt in this._objects, add it
	if( this._objects.indexOf(object) === -1 )	this._objects.push(object)
};



//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

THREEx.DomEvents.prototype.processIntersects = function(intersects, eventType){	

	intersects.forEach(function(intersect){
		var event = {
			type : eventType,
			object : intersect.object,
			intersect : intersect
		}
		notify(intersect.object, event, intersect)		
	})
	
	return
	
	function notify(object, event, intersect) {
		if( object.userData.listeners !== undefined ){
			object.userData.listeners[event.type].slice(0).forEach(function(listener){		
				listener.callback(event)
				// TODO here handle the stopPropagation
			})
		}
		
		if( object.parent ){
			notify(object.parent, event, intersect)
		}
	};
	
}
