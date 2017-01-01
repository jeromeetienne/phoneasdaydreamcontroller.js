var THREEx = THREEx || {}


THREEx.DaydreamModel = function(){
	var _this = this
	this.object3d = new THREE.Group
	
	var modelPath = 'vendor/VR-Controller-Daydream/'
	var meshes = {}
	var model = null

	this.update = function(gamepad){
		if( model === null )	return 
// return
		var bodyMesh = model.getObjectByName('Body_Body_Cylinder')
		var volDownMesh = model.getObjectByName('VolDownButton_VolDownButton_Cylinder.001')
		var volUpMesh = model.getObjectByName('VolUpButton_VolUpButton_Cylinder.002')
		var touchpadMesh = model.getObjectByName('TouchPad_TouchPad_Cylinder.003')
		var appButtonMesh = model.getObjectByName('AppButton_AppButton_Cylinder.004')
		var homeButtonMesh = model.getObjectByName('HomeButton_HomeButton_Cylinder.005')
		var touchpadLocationMesh = model.getObjectByName('TouchpadTouchLocation')
			

		var appButton = gamepad.buttons[PhoneAsVRController.buttonIndex.app]
		if( appButton.pressed === true ){
			appButtonMesh.material.emissive.set('#333')
		}else{
			appButtonMesh.material.emissive.set('#000')			
		}

		var homeButton = gamepad.buttons[PhoneAsVRController.buttonIndex.home]
		if( homeButton.pressed === true ){
			homeButtonMesh.material.emissive.set('#333')
		}else{
			homeButtonMesh.material.emissive.set('#000')
		}

		var trackpadButton = gamepad.buttons[PhoneAsVRController.buttonIndex.trackpad]
		if( trackpadButton.pressed === true ){
			touchpadMesh.material.emissive.set('#333')
			touchpadLocationMesh.visible = true

			var touchpadAxes = gamepad.axes[PhoneAsVRController.axesIndex.trackpad]
			touchpadLocationMesh.position.copy(touchpadLocationMesh.userData.center)
			touchpadLocationMesh.position.x += touchpadAxes[0] * touchpadLocationMesh.userData.ray
			touchpadLocationMesh.position.z += touchpadAxes[1] * touchpadLocationMesh.userData.ray
		}else{
			touchpadMesh.material.emissive.set('#000')
			touchpadLocationMesh.visible = false					
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
			model = object
			

			_this.object3d.add(object)

			object.scale.multiplyScalar(4)

			// create touchpadLocationMesh
			var geometry = new THREE.SphereGeometry(0.002)
			var material = new THREE.MeshBasicMaterial({
				color : 'lightgrey'
			})
			var touchpadLocationMesh = new THREE.Mesh(geometry, material)
			touchpadLocationMesh.name = 'TouchpadTouchLocation'
			touchpadLocationMesh.visible = false
			touchpadLocationMesh.userData.center = new THREE.Vector3(0,0.008, -0.035)
			touchpadLocationMesh.userData.ray = 0.015
			object.add(touchpadLocationMesh)

			
			var bodyMesh = object.getObjectByName('Body_Body_Cylinder')
			var volDownMesh = object.getObjectByName('VolDownButton_VolDownButton_Cylinder.001')
			var volUpMesh = object.getObjectByName('VolUpButton_VolUpButton_Cylinder.002')
			var touchpadMesh = object.getObjectByName('TouchPad_TouchPad_Cylinder.003')
			var appButtonMesh = object.getObjectByName('AppButton_AppButton_Cylinder.004')
			var homeButtonMesh = object.getObjectByName('HomeButton_HomeButton_Cylinder.005')
			var touchpadLocationMesh = object.getObjectByName('TouchpadTouchLocation')
			
			bodyMesh.material.shininess = 6
			bodyMesh.material.shading = THREE.SmoothShading
			bodyMesh.material.needsUpdate = true
			
			bodyMesh.material = bodyMesh.material.clone()
			appButtonMesh.material = bodyMesh.material.clone()

			homeButtonMesh.material = bodyMesh.material.clone()
			
			touchpadMesh.material = bodyMesh.material.clone()
		});

	});	

}
