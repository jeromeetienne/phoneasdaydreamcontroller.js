var THREEx = THREEx || {}
THREEx.WebvrRecorder = function(){
        var frameData = new VRFrameData()
}
var THREEx = THREEx || {}

THREEx.WebvrRecorder = function(){
        THREEx.JsonRecorder.call( this );
        
        this._vrDisplay
        
        
        this.autoSaveBaseName = 'webvrrecords'
        this.setVRDisplay = function(vrDisplay){
                this._vrDisplay = vrDisplay
        }
                
        this._fetchNewRecordData = function(newRecord){
                this._vrDisplay.getFrameData(frameData);
                return frameData
        }
}
THREEx.WebvrRecorder.prototype = Object.create( THREEx.JsonRecorder.prototype );
THREEx.WebvrRecorder.prototype.constructor = THREEx.WebvrRecorder;

// THREEx.WebvrRecorder = function(){
//         var _this = this
//         _this._vrDisplay = null
//         // parameters
//         this.autoSave = true
//         this.autoSaveMaxLength = 100
//         this.autoSaveBaseName = 'webvrrecords'
//         this.updatePeriod = 1000/100
//         var autoSaveCounter = 0
// 
// 	var frameData = new VRFrameData()
// 
//         var records = {
//                 createdAt : Date.now(),
//                 values : []    
//         }
// 
//         ////////////////////////////////////////////////////////////////////////////////
//         //          Code Separator
//         ////////////////////////////////////////////////////////////////////////////////
//         var timerId = null
//         this.start = function(vrDisplay){
// 		_this._vrDisplay = vrDisplay
//                 console.assert(timerId === null)
//                 timerId = setInterval(update, _this.updatePeriod)
//         }
//         this.stop = function(){
//                 if( _this.autoSave === true )   autoSave()
// 
//                 autoSaveCounter = 0
// 		_this._vrDisplay = null
//                 
//                 clearInterval(timerId)
//                 timerId = null
//         }
//         return
// 
//         function update(){
//                 _this._vrDisplay.getFrameData(frameData);
//                 // add this value 
//                 records.values.push({
//                         recordedAt : Date.now(),
//                         data : cloneObject(frameData)
//                 })
//                 // honor autoSave
//                 if( _this.autoSave === true && records.values.length >= _this.autoSaveMaxLength ){
//                         autoSave()
//                 }
//         }
//         
//         function autoSave(){
//                 // save records
//                 var basename = _this.autoSaveBaseName+pad(autoSaveCounter, 4)+'.json'
//                 var jsonString = JSON.stringify(records, null, "\t"); 
//                 // var jsonString = JSON.stringify(records); 
//                 download(jsonString, basename, 'application/json');
// 
//                 // update autoSaveCounter
//                 autoSaveCounter++;                
//                 
//                 // clear records
//                 records.createdAt = Date.now()
//                 records.values = []                
//         }
//         function pad(num, size) {
//                 var s = num + '';
//                 while (s.length < size) s = '0' + s;
//                 return s;
//         }
// }
