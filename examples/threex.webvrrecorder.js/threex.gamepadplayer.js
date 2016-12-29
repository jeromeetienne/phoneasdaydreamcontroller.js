var THREEx = THREEx || {}

THREEx.GamepadPlayer = function(){
        _this._records = null
        var nextValueIndex = 0

        var startedAt = null
        var timerId = null


        this.load = function(urls, onLoaded){
                
                var countRemaining = urls.length
                for(var i = 0; i < urls.length; i++){
                        doLoad(urls[i], function(content){
                                countRemaining--
                        })
                }
                function doLoad(url, onLoaded){
                        var request = new XMLHttpRequest()
                        request.addEventListener('load', function(){
                                onLoaded(this.responseText)
                        })
                        request.open('GET', url)
                        request.send()
                }
        }

        this.start = function(records){
                startedAt = Date.now()
                _this._records = records
                
                console.assert(timerId !== null)
                var delay = computeNextRecordDelay()
                timerId( onNextValue, delay)

                // navigator.getGamepads = function(){
                // 	return phoneAsVRController.getGamepads()
        	// }
        }
        this.stop = function(){
                startedAt = null
        }
        return
        
        function onNextValue(){
                var value = _this._records.values[nextValueIndex]
                nextValueIndex ++
                
                var gamepads = value.data
        }

        function computeNextRecordDelay(){
                if( nextValueIndex >= _this._records.values.length )    return -1
                
                var value = _this._records.values[nextValueIndex]
                // var value.recordedAt - _this.records.createdAt
                
        }
}

