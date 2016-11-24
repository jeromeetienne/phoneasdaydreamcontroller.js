var THREEx = THREEx || {}

THREEx.VRUiUtils = {}

THREEx.VRUiUtils.createCanvasTexture = function(width, height){
        // build canvas itemBack
        var canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        // build the texture from canvas
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true
        
        return texture
}