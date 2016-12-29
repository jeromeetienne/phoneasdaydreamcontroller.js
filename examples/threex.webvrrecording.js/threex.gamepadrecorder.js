var THREEx = THREEx || {}

THREEx.GamepadRecorder = function(){
        var _this = this
        
        // parameters
        this.autoSave = true
        this.autoSaveMaxLength = 1000
        this.autoSaveBaseName = 'gamepadrecords'
        this.updatePeriod = 1000/100
        var autoSaveCounter = 0

        var records = {
                createdAt : Date.now(),
                values : []    
        }

        ////////////////////////////////////////////////////////////////////////////////
        //          Code Separator
        ////////////////////////////////////////////////////////////////////////////////
        var timerId = null
        this.start = function(){
                console.assert(timerId === null)
                timerId = setInterval(update, _this.updatePeriod)
        }
        this.stop = function(){
                if( _this.autoSave === true )   autoSave()

                autoSaveCounter = 0
                
                clearInterval(timerId)
                timerId = null
        }
        return

        function update(){
                var gamepads = navigator.getGamepads();
                // clone the struct
                // gamepads = JSON.parse(JSON.stringify(gamepads))
                gamepads = cloneObject(gamepads)
                // add this value 
                records.values.push({
                        recordedAt : Date.now(),
                        data : gamepads
                })
                // honor autoSave
                if( _this.autoSave === true && records.values.length >= _this.autoSaveMaxLength ){
                        autoSave()
                }
        }
        
        function autoSave(){
                // save records
                var basename = _this.autoSaveBaseName+pad(autoSaveCounter, 2)+'.json'
                var jsonString = JSON.stringify(records, null, "\t"); 
                // var jsonString = JSON.stringify(records); 
                download(jsonString, basename, 'application/json');

                // update autoSaveCounter
                autoSaveCounter++;                
                
                // clear records
                records.createdAt = Date.now()
                records.values = []                
        }
        function pad(num, size) {
                var s = num + '';
                while (s.length < size) s = '0' + s;
                return s;
        }
}

