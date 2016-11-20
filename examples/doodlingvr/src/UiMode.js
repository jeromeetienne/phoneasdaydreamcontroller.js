/**
 * Mother class for each UiMode
 */
function UiMode(app){
	
	/* Here you initialize this UiMode
	 */


	/**
	 * return all the actionable object3d of this UiMode
	 * - they will be then feed to ray intersects
	 *
	 * @return {[THREE.Object3d]} - the array of object3d
	 */
	this.getActionableObjects = function(){
		return []
	}

	/**
	 * dispose of this UiMode - aka deallocate rescources
	 */
	this.dispose = function(){
	}
	
	/**
	 * update this UiMode - aka called at every frame
	 */
	this.update = function(){
	}
}
