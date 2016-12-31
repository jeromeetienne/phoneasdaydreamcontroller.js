var THREEx = THREEx || {}

THREEx.WebvrRecorder = function(){
        THREEx.JsonRecorder.call( this );

        this.autoSaveBaseName = 'webvrrecords'
                
	var frameData = new VRFrameData()
        this._fetchNewRecordData = function(newRecord){
                this._vrDisplay.getFrameData(frameData);
                var frameDataJSON = JSON.parse(JSON.stringify(frameData))
                return frameDataJSON
        }
        
        this._vrDisplay = null
        this.setVRDisplay = function(vrDisplay){
                this._vrDisplay = vrDisplay
                return this
        }
}
THREEx.WebvrRecorder.prototype = Object.create( THREEx.JsonRecorder.prototype );
THREEx.WebvrRecorder.prototype.constructor = THREEx.WebvrRecorder;
