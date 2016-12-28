var THREEx = THREEx || {}

THREEx.GamepadRecorder = function(){
        var _this = this
        
        this.autoSave = true
        this.autoSaveMaxLength = 1000
        this.updatePeriod = 1000/100

        var records = {
                createdAt : Date.now(),
                values : []    
        }

        function update(){
                var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
                // add this value 
                records.values.push({
                        recordedAt : Date.now(),
                        data : gamepads
                })
                // honor autoSave
                if( _this.autoSave === true && records.values.length >= _this.autoSaveMaxLength ){
                        saveRecords()
                        clearRecords()
                }
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
                clearInterval(timerId)
                timerId = null
        }
        return

        function clearRecords(){
                records.createdAt = Date.now()
                records.values = []                
        }
        function saveRecords(){
                // pick a better names
                // - from-startedAt-to-savedAt.json
                var basename = 'gamepadapi-records.json'
                var jsonString = JSON.stringify(records)
                download(jsonString, basename, "text/plain");
        }        
}

