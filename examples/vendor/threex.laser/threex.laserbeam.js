var THREEx = THREEx || {}

THREEx.LaserBeam	= function(){
	var object3d	= new THREE.Object3D()
	this.object3d	= object3d
	// generate the texture
	var canvas	= generateLaserBodyCanvas()
	var texture	= new THREE.Texture( canvas )
	texture.needsUpdate	= true;
	// do the material	
	var material	= new THREE.MeshBasicMaterial({
		map		: texture,
		blending	: THREE.AdditiveBlending,
		color		: 0x4444aa,
		side		: THREE.DoubleSide,
		depthWrite	: false,
		transparent	: true
	})
	var geometry	= new THREE.PlaneGeometry(0.1, 1)
	var nPlanes	= 16;
	for(var i = 0; i < nPlanes; i++){
		var mesh	= new THREE.Mesh(geometry, material)
		mesh.rotation.x	= Math.PI/2
		mesh.position.z	= -1/2
		mesh.rotation.y	= i/nPlanes * Math.PI
		object3d.add(mesh)
	}
	
	this.getLength = function(length){
		return object3d.scale.z
	}
	this.setLength = function(length){
		if( length < 0.01 )	length = 0.01
		object3d.scale.z	= length
	}
	return
	
	function generateLaserBodyCanvas(){
		// init canvas
		var canvas	= document.createElement( 'canvas' );
		var context	= canvas.getContext( '2d' );
		canvas.width	= 64;
		canvas.height	= 1;
		// set gradient
		var gradient	= context.createLinearGradient(0, 0, canvas.width, canvas.height);		
		gradient.addColorStop( 0  , 'rgba(  0,  0,  0,0.1)' );
		gradient.addColorStop( 0.1, 'rgba(160,160,160,0.3)' );
		gradient.addColorStop( 0.5, 'rgba(255,255,255,0.5)' );
		gradient.addColorStop( 0.9, 'rgba(160,160,160,0.3)' );
		gradient.addColorStop( 1.0, 'rgba(  0,  0,  0,0.1)' );
		// fill the rectangle
		context.fillStyle	= gradient;
		context.fillRect(0,0, canvas.width, canvas.height);
		// return the just built canvas 
		return canvas;	
	}
}
