var THREEx = THREEx || {}

THREEx.JsonRecorder = function(){
        var _this = this

	_this._fetchNewRecordData = function(){ return 'newRecord'}      // overload this function
        
        // parameters
        this.autoSave = true
        this.autoSaveMaxLength = 1000
        this.autoSaveBaseName = 'jsonrecords'
        this.updatePeriod = 1000/100
        var autoSaveCounter = 0


        var records = {
                startedAt : Date.now(),
                values : []    
        }

        ////////////////////////////////////////////////////////////////////////////////
        //          Code Separator
        ////////////////////////////////////////////////////////////////////////////////
        var timerId = null
        this.start = function(){
                console.assert(timerId === null)
                timerId = setInterval(update, _this.updatePeriod)
                return this
        }
        this.stop = function(){
                if( _this.autoSave === true )   autoSave()

                autoSaveCounter = 0
                
                clearInterval(timerId)
                timerId = null
                return this
        }
        return

        function update(){
                var recordData = _this._fetchNewRecordData()
                // add this value 
                records.values.push({
                        recordedAt : Date.now(),
                        data : recordData
                })
                // honor autoSave
                if( _this.autoSave === true && records.values.length >= _this.autoSaveMaxLength ){
                        autoSave()
                }
        }
        
        function autoSave(){
                // save records
                var basename = _this.autoSaveBaseName+pad(autoSaveCounter, 4)+'.json'
                var jsonString = JSON.stringify(records, null, "\t"); 
                // var jsonString = JSON.stringify(records); 
                download(jsonString, basename, 'application/json');

                // update autoSaveCounter
                autoSaveCounter++;                
                
                // clear records
                records.startedAt = Date.now()
                records.values = []                
        }
        function pad(num, size) {
                var s = num + '';
                while (s.length < size) s = '0' + s;
                return s;
        }
}
