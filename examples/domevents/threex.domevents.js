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
		'mousemove' : [],

		'click' : [],
		'mouseenter' : [],
		'mouseleave' : [],
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

THREEx.DomEvents.prototype.removeEventListener = function (object, eventType, callback, useCapture) {
	console.assert(false, 'NOT YET IMPLEMENTED')
}


//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////



THREEx.DomEvents.prototype.processIntersects = function(pointerContext, intersects, eventType){	

	intersects.forEach(function(intersect){
		notify(intersect.object, {
			type : eventType,
			object : intersect.object,
			intersect : intersect
		})
	})
	
	// generate 'click' event 
	if( eventType === 'mouseup' && intersects.length >= 1 ){
		if( pointerContext.lastMouseDownObject === intersects[0].object ){
			this.processIntersects(pointerContext, intersects, 'click')
		}
	}
	
	// handle mouseleave/mouseenter thru mousemove
	if( eventType === 'mousemove' ){
		var currentObject = intersects.length ? intersects[0].object : null
		if( currentObject !== pointerContext.lastMouseMoveObject && pointerContext.lastMouseMoveObject !== null ){
			// TODO should set hovering = false to lastMouseMoveObject and all its parent
			// - on each node, dispatch mouseLeave or not depending on previous hovering
			// - if hovering was already false, do nothing
			// - if hovering was true, notify a mouse leave
			// - 	function notifyEnterLeave(object, event, newHovering)
			notify(pointerContext.lastMouseMoveObject, {
				type : 'mouseleave',
				object : pointerContext.lastMouseMoveObject,
				intersect : intersects[0]
			})
		}
		if( currentObject !== pointerContext.lastMouseMoveObject && currentObject !== null ){
			// TODO should set hovering = true to currentObject and all its parent
			// - on each node, dispatch mouseEnter or not depending on previous hovering
			// - if hovering was already true, do nothing
			// - if hovering was false, notify a mouse enter
			// - 	function notifyEnterLeave(object, event, newHovering)
			notify(currentObject, {
				type : 'mouseenter',
				object : currentObject,
				intersect : intersects[0]
			})
		}
	}

	// update pointerContext.lastMouseDownObject
	if( eventType === 'mousedown' ){
		pointerContext.lastMouseDownObject = intersects.length === 0 ? null : intersects[0].object
	}
	// update pointerContext.lastMouseMoveObject
	if( eventType === 'mousemove' ){
		pointerContext.lastMouseMoveObject = intersects.length === 0 ? null : intersects[0].object
	}
	return
	
	function notify(object, event) {
		object.userData.listeners && object.userData.listeners[event.type].slice(0).forEach(function(listener){		
			listener.callback(event)
			// TODO here handle the stopPropagation
		})
		
		if( object.parent ){
			notify(object.parent, event)
		}
	};
}


////////////////////////////////////////////////////////////////////////////////
//          Code Separator
////////////////////////////////////////////////////////////////////////////////

/**
 * sub class to init the variables per ray
 * - contains state variable to handle click, mouseenter, mouseleave
 */
THREEx.DomEvents.PointerContext = function(){
	this.lastMouseDownObject = null
	this.lastMouseMoveObject = null
}
