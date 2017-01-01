var THREEx = THREEx || {}


THREEx.DaydreamModel = function(modelPath){
	var _this = this
	this.object3d = new THREE.Group
	
	modelPath = modelPath || 'vendor/VR-Controller-Daydream/'
	var meshes = {}

	this.update = function(gamepad){
		// if meshes arent yet loaded, return now
		if( Object.keys(meshes).length === 0 )	return 
			
		var appButton = gamepad.buttons[PhoneAsVRController.buttonIndex.app]
		if( appButton.pressed === true ){
			meshes.appButton.material.emissive.set('#333')
		}else{
			meshes.appButton.material.emissive.set('#000')			
		}

		var homeButton = gamepad.buttons[PhoneAsVRController.buttonIndex.home]
		if( homeButton.pressed === true ){
			meshes.homeButton.material.emissive.set('#333')
		}else{
			meshes.homeButton.material.emissive.set('#000')
		}

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
	

	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath( modelPath );
	mtlLoader.load( 'vr_controller_daydream.mtl', function( materials ) {
		materials.preload();
		
		
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
		objLoader.setPath( modelPath );
		objLoader.load( 'vr_controller_daydream.obj', function ( object ) {
			meshes.model = object
			

			_this.object3d.add(meshes.model)

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
			meshes.model.add(meshes.touchpadLocation)

			
			meshes.body = meshes.model.getObjectByName('Body_Body_Cylinder')
			meshes.volDown = meshes.model.getObjectByName('VolDownButton_VolDownButton_Cylinder.001')
			meshes.volUp = meshes.model.getObjectByName('VolUpButton_VolUpButton_Cylinder.002')
			meshes.touchpad = meshes.model.getObjectByName('TouchPad_TouchPad_Cylinder.003')
			meshes.appButton = meshes.model.getObjectByName('AppButton_AppButton_Cylinder.004')
			meshes.homeButton = meshes.model.getObjectByName('HomeButton_HomeButton_Cylinder.005')
			meshes.touchpadLocation = meshes.model.getObjectByName('TouchpadTouchLocation')
			
			meshes.body.material.shininess = 6
			meshes.body.material.shading = THREE.SmoothShading
			meshes.body.material.needsUpdate = true
			
			meshes.body.material = meshes.body.material.clone()
			meshes.appButton.material = meshes.body.material.clone()
			meshes.homeButton.material = meshes.body.material.clone()
			meshes.touchpad.material = meshes.body.material.clone()
		});
	});	
}
