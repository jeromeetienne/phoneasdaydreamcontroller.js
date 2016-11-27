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



THREEx.DomEvents.prototype._handleMouseMove = function(pointerContext, intersects, eventType){	
	console.assert(eventType === 'mousemove')
	
	var intersectObject = intersects.length ? intersects[0].object : null

	// send mouselease to .lastMouseMoveObject if .lastMouseMoveObject isn't the current intersect object
	if( intersectObject !== pointerContext.lastMouseMoveObject && pointerContext.lastMouseMoveObject !== null ){
		// TODO should set hovering = false to lastMouseMoveObject and all its parent
		// - on each node, dispatch mouseLeave or not depending on previous hovering
		// - if hovering was already false, do nothing
		// - if hovering was true, notify a mouse leave
		// - 	function notifyEnterLeave(object, event, newHovering)
		notifyEnterLeave(pointerContext.lastMouseMoveObject, {
			type : 'mouseleave',
			object : pointerContext.lastMouseMoveObject,
			intersect : intersects[0]
		}, false)
	}
	if( intersectObject !== pointerContext.lastMouseMoveObject && intersectObject !== null ){
		// TODO should set hovering = true to intersectObject and all its parent
		// - on each node, dispatch mouseEnter or not depending on previous hovering
		// - if hovering was already true, do nothing
		// - if hovering was false, notify a mouse enter
		// - 	function notify(object, event, newHovering)
		notifyEnterLeave(intersectObject, {
			type : 'mouseenter',
			object : intersectObject,
			intersect : intersects[0]
		}, true)
	}

	// update pointerContext.lastMouseMoveObject
	pointerContext.lastMouseMoveObject = intersects.length === 0 ? null : intersects[0].object
	return
	
	function notifyEnterLeave(object, event, newHovering) {
		if( object.userData.hovering !== newHovering ){
			object.userData.hovering = newHovering
			object.userData.listeners && object.userData.listeners[event.type].slice(0).forEach(function(listener){		
				listener.callback(event)
				// TODO here handle the stopPropagation
			})			
		}
		// propagate the event to the parent
		if( object.parent ){
			notifyEnterLeave(object.parent, event, newHovering)
		}
	};
	
	//////////////////////////////////////////////////////////////////////////////
	//		Code Separator
	//////////////////////////////////////////////////////////////////////////////
	function notifyEnterLeave(object, event, newHovering) {
		if( event.type === 'mouseleave' )	return notifyLeave(object,event,newHovering)
		else if( event.type === 'mouseenter' )	return notifyEnter(object,event,newHovering)
		else console.assert(false)
	}

	function notifyLeave(object, event, newHovering) {
		object.userData.shouldSendLeave = true

		// propagate the event to the parent
		if( object.parent ){
			notifyEnterLeave(object.parent, event, newHovering)
		}
	};

	function notifyEnter(object, event, newHovering) {
		object.userData.shouldSendEnter = true

		// propagate the event to the parent
		if( object.parent ){
			notifyEnterLeave(object.parent, event, newHovering)
		}
	};
}

/**
 * [processIntersects description]
 * @param {[type]} pointerContext [description]
 * @param {[type]} intersects     [description]
 * @param {[type]} eventType      [description]
 * @return {[type]} [description]
 */
THREEx.DomEvents.prototype.processIntersects = function(pointerContext, intersects, eventType){	
	// sanity check
	console.assert(['mousedown', 'mouseup', 'mousemove', 'click'].indexOf(eventType) !== -1 )

	notifyToIntersects(intersects, eventType)
	
	//////////////////////////////////////////////////////////////////////////////
	//		Handle click
	//////////////////////////////////////////////////////////////////////////////	
	// generate 'click' event 
	if( eventType === 'mouseup' && intersects.length >= 1 ){
		// click happen if mousedown is happening on the same dobject as the mouseup
		// - this is the definition of a click by web standard
		if( pointerContext.lastMouseDownObject === intersects[0].object ){
			this.processIntersects(pointerContext, intersects, 'click')
		}
	}
	// update pointerContext.lastMouseDownObject
	if( eventType === 'mousedown' ){
		pointerContext.lastMouseDownObject = intersects.length === 0 ? null : intersects[0].object
	}

	//////////////////////////////////////////////////////////////////////////////
	//		Handle enter/leave
	//////////////////////////////////////////////////////////////////////////////
	// handle mouseleave/mouseenter thru mousemove
	if( eventType === 'mousemove' ){
		this._handleMouseMove(pointerContext, intersects, eventType)
	}

	return;
	
	function notifyToIntersects(intersects, eventType){
		intersects.forEach(function(intersect){
			notifyToObject(intersect.object, {
				type : eventType,
				object : intersect.object,
				intersect : intersect
			})
		})
		return

		function notifyToObject(object, event) {
			// notify all listeners of this event.type
			object.userData.listeners && object.userData.listeners[event.type].slice(0).forEach(function(listener){		
				listener.callback(event)
				// TODO here handle the stopPropagation
			})
			
			// bubble the event to the parent
			if( object.parent ){
				notifyToObject(object.parent, event)
			}
		}
	}
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
