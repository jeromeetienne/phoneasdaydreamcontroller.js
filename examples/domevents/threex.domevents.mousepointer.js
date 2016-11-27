var THREEx = THREEx || {}


THREEx.DomEvents.MousePointer = function(element, domEvents){
	// pointer context for the mouse
	var pointerContext = new THREEx.DomEvents.PointerContext()

	// keep the coordinate of the mouse
	var mouse = new THREE.Vector2();
	element.addEventListener( 'mousemove', onMouseMove, false );
	function onMouseMove( event ) {
		mouse.x =   ( event.clientX / element.clientWidth  ) * 2 - 1;
		mouse.y = - ( event.clientY / element.clientHeight ) * 2 + 1;	
	}
	
	// listen to all core events
	element.addEventListener('mousemove', processDomEvent, false)
	element.addEventListener('mousedown', processDomEvent, false)
	element.addEventListener('mouseup', processDomEvent, false)

	// setup raycaster, compute intersects, and then procee it thru domEvents
	var raycaster = new THREE.Raycaster();
	function processDomEvent(domEvent){
		raycaster.setFromCamera( mouse, camera );
		
		var intersects = raycaster.intersectObjects( domEvents._objects );
		
		domEvents.processIntersects(pointerContext, intersects, domEvent.type)
	}
	
	// dispose of the object - aka remove all listener
	this.dispose = function(){
		element.removeEventListener( 'mousemove', onMouseMove, false );

		element.removeEventListener( 'mousemove', processDomEvent, false)
		element.removeEventListener( 'mousedown', processDomEvent, false)
		element.removeEventListener( 'mouseup'  , processDomEvent, false)
	}
}
