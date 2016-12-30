var THREEx = THREEx || {}

THREEx.GamepadPlayer = function(){
        var _this = this

        _this.gamepads = [
                null,
                null,
                null,
                null,
        ]
        _this._records = null

        ////////////////////////////////////////////////////////////////////////////////
        //          load files
        ////////////////////////////////////////////////////////////////////////////////
        
        this.load = function(urls, onLoaded){
                loadUrl()
                return
                
                function loadUrl(){
                        if( urls.length === 0 ){
                                onLoaded()
                                return
                        }
                        // get next url
                        var url = urls.shift()
                        // load next url
                        doHttpRequest(url, function(content){
                                var loadedRecords = JSON.parse(content)
                                // TODO merge them instead of overwrite the last
                                // - be carefull with the order... onLoaded can be called out of order\
                                // - cache value until countRemaining === 0, and then merge
                                if( _this._records === null ){
                                        _this._records = loadedRecords                                        
                                }else{
                                        _this._records.values.push.apply(_this._records.values, loadedRecords.values);
                                }
                                
                                loadUrl()
                        })
                }
                
                function doHttpRequest(url, onLoaded){
                        var request = new XMLHttpRequest()
                        request.addEventListener('load', function(){
                                onLoaded(this.responseText)
                        })
                        request.open('GET', url)
                        request.send()
                }
        }

        var nextValueIndex = 0
        var startedAt = null
        var timerId = null

        this.start = function(){
                console.assert(startedAt === null)
                startedAt = Date.now()
                
                console.assert(timerId === null)
                var nextDelay = computeNextValuesDelay()
                timerId = setTimeout( dispatchNextValue, nextDelay )
        }
        this.stop = function(){
                startedAt = null
                nextValueIndex = 0

                clearTimeout(timerId)
                timerId = null
        }
        return
        
        function dispatchNextValue(){
                var value = _this._records.values[nextValueIndex]

                _this.gamepads = value.data

                nextValueIndex ++

                var nextDelay = computeNextValuesDelay()
                if( nextDelay === -1 )  return
                timerId = setTimeout( dispatchNextValue, nextDelay )
        }

        function computeNextValuesDelay(){
                // console.log('nextValueIndex', nextValueIndex)
                if( nextValueIndex >= _this._records.values.length )    return -1
                var value = _this._records.values[nextValueIndex]

                var deltaTime = value.recordedAt - _this._records.createdAt
                var absoluteTime = startedAt + deltaTime

                var waitTime = Date.now() - absoluteTime

                return waitTime
        }
}
