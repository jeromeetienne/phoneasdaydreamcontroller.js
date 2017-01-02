var THREEx = THREEx || {}


THREEx.DaydreamModel = function(modelPath){
	var _this = this
	this.object3d = new THREE.Group
	
	modelPath = modelPath || 'vendor/VR-Controller-Daydream/'
	var meshes = {}
	
	// update display based on the gamepad value
	this.update = function(gamepad){
		// if meshes arent yet loaded, return now
		if( Object.keys(meshes).length === 0 )	return 
			
		// appButton
		var appButton = gamepad.buttons[PhoneAsVRController.buttonIndex.app]
		if( appButton.pressed === true ){
			meshes.appButton.material.emissive.set('#333')
		}else{
			meshes.appButton.material.emissive.set('#000')			
		}

		// homeButton
		var homeButton = gamepad.buttons[PhoneAsVRController.buttonIndex.home]
		if( homeButton.pressed === true ){
			meshes.homeButton.material.emissive.set('#333')
		}else{
			meshes.homeButton.material.emissive.set('#000')
		}

		// trackpadButton
		var trackpadButton = gamepad.buttons[PhoneAsVRController.buttonIndex.trackpad]
		if( trackpadButton.pressed === true ){
			meshes.touchpad.material.emissive.set('#333')
			meshes.touchpadLocation.visible = true

			var touchpadAxes = gamepad.axes[PhoneAsVRController.axesIndex.trackpad]
			meshes.touchpadLocation.position.copy(meshes.touchpadLocation.userData.center)
			meshes.touchpadLocation.position.x += touchpadAxes[0] * meshes.touchpadLocation.userData.ray
			meshes.touchpadLocation.position.z += touchpadAxes[1] * meshes.touchpadLocation.userData.ray
		}else{
			meshes.touchpad.material.emissive.set('#000')
			meshes.touchpadLocation.visible = false					
		}
	}
	

	// load the model
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath( modelPath );
	mtlLoader.load( 'vr_controller_daydream.mtl', function( materials ) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
		objLoader.setPath( modelPath );
		objLoader.load( 'vr_controller_daydream.obj', function ( object ) {
			// init the model
			initModel(object)
		});
	});	
	
	return
	
	function initModel(model){

		_this.object3d.add(model)

		
		meshes.model = model
		meshes.model.scale.multiplyScalar(4)

		// create touchpadLocationMesh
		var geometry = new THREE.SphereGeometry(0.002)
		var material = new THREE.MeshBasicMaterial({
			color : 'lightgrey'
		})
		meshes.touchpadLocation = new THREE.Mesh(geometry, material)
		meshes.touchpadLocation.name = 'TouchpadTouchLocation'
		meshes.touchpadLocation.visible = false
		meshes.touchpadLocation.userData.center = new THREE.Vector3(0,0.008, -0.035)
		meshes.touchpadLocation.userData.ray = 0.015
		model.add(meshes.touchpadLocation)

		
		meshes.body = model.getObjectByName('Body_Body_Cylinder')
		meshes.volDown = model.getObjectByName('VolDownButton_VolDownButton_Cylinder.001')
		meshes.volUp = model.getObjectByName('VolUpButton_VolUpButton_Cylinder.002')
		meshes.touchpad = model.getObjectByName('TouchPad_TouchPad_Cylinder.003')
		meshes.appButton = model.getObjectByName('AppButton_AppButton_Cylinder.004')
		meshes.homeButton = model.getObjectByName('HomeButton_HomeButton_Cylinder.005')
		meshes.touchpadLocation = model.getObjectByName('TouchpadTouchLocation')
		
		var baseMaterial = meshes.body.material
		baseMaterial.shininess = 6
		baseMaterial.shading = THREE.SmoothShading
		baseMaterial.needsUpdate = true
		
		meshes.body.material = baseMaterial.clone()
		meshes.appButton.material = baseMaterial.clone()
		meshes.homeButton.material = baseMaterial.clone()
		meshes.touchpad.material = baseMaterial.clone()
	}

}
