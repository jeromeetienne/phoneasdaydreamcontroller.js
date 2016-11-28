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


/**
 * handle mousemove to notify mouseenter/mouseleave according to pointerContext
 * - it doesnt notify leave, then enter in the same js loop
 */
THREEx.DomEvents.prototype._processMouseMove = function(pointerContext, intersects, eventType){	
	console.assert(eventType === 'mousemove')
	
	var intersectObject = intersects.length ? intersects[0].object : null
	
	var leaveObjects = []
	var enterObjects = []

	// send mouselease to .lastMouseMoveObject if .lastMouseMoveObject isn't the current intersect object
	if( intersectObject !== pointerContext.lastMouseMoveObject && pointerContext.lastMouseMoveObject !== null ){
		for(var object = pointerContext.lastMouseMoveObject; object !== null; object = object.parent){
			leaveObjects.push(object)
		}
	}
	
	// send mouseenter to intersectObject if intersectObject isnt equal to .lastMouseMoveObjects
	if( intersectObject !== pointerContext.lastMouseMoveObject && intersectObject !== null ){
		for(var object = intersectObject; object !== null; object = object.parent){
			// if this object is in leaveObjects, leave and enter cancel each other
			// so remove it from leaveObjects and dont include in enterObjects
			var index = leaveObjects.indexOf(object) 
			if( index !== -1 ){
				leaveObjects.splice(index, 1)
				continue
			}
			
			// add this object in enterObjects
			enterObjects.push(object)
		}
	}
	
	// notify mouseleave to all the object of leaveObjects
	leaveObjects.forEach(function(object){
		notifyAllListeners(object, {
			type : 'mouseleave',
			object : pointerContext.lastMouseMoveObject,
			intersect : intersects[0]
		})
	})

	// notify mouseenter to all object of enterObjects
	enterObjects.forEach(function(object){
		notifyAllListeners(object, {
			type : 'mouseenter',
			object : intersectObject,
			intersect : intersects[0]
		})
	})

	// update pointerContext.lastMouseMoveObject
	pointerContext.lastMouseMoveObject = intersects.length === 0 ? null : intersects[0].object
	// console.log('lastMouseMoveObject', pointerContext.lastMouseMoveObject === null ? null : pointerContext.lastMouseMoveObject.name )
	return
	
	function notifyAllListeners(object, event){
		// notify all listeners of this event.type
		object.userData.listeners && object.userData.listeners[event.type].slice(0).forEach(function(listener){		
			listener.callback(event)
			// TODO here handle the stopPropagation
		})		
	}
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
		this._processMouseMove(pointerContext, intersects, eventType)
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
	}
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
