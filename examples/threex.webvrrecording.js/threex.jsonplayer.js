var THREEx = THREEx || {}

THREEx.JsonPlayer = function(){
        var _this = this

        _this._records = null
	_this._onNewRecord = function(newRecord){}      // overload this function
        _this.playbackRate = 1

        ////////////////////////////////////////////////////////////////////////////////
        //          load files
        ////////////////////////////////////////////////////////////////////////////////
        
        this.load = function(urls, onLoaded){
                loadUrl()
                return
                
                function loadUrl(){
                        // if there is no more urls to load, return now
                        if( urls.length === 0 ){
                                onLoaded()
                                return
                        }
                        // get next url
                        var url = urls.shift()
                        // load next url
                        doHttpRequest(url, function(content){
                                var loadedRecords = JSON.parse(content)
                                if( _this._records === null ){
                                        // if this is the first file ot be loaded
                                        _this._records = loadedRecords                                        
                                }else{
                                        // concatenate the values array of local records and the loaded ones
                                        _this._records.values.push.apply(_this._records.values, loadedRecords.values);
                                }
                                
                                loadUrl()
                        })
                }
                return

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

        this.start = function(skipTime){
                console.assert(startedAt === null)
                startedAt = Date.now()
                
                // honor skipTime
                if( skipTime !== undefined ){
                        startedAt -= skipTime
                        // find nextValueIndex for this skipTime
                        while(true){
                                if( nextValueIndex + 1 >= _this._records.values.length ) break;
                                var value = _this._records.values[nextValueIndex+1]
                                if( value.recordedAt >= _this._records.startedAt + skipTime ) break
                                nextValueIndex++
                        }
                }
                // console.log('startedAt', startedAt, nextValueIndex, skipTime)
                
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

		_this._onNewRecord(value.data)

                nextValueIndex ++

                var nextDelay = computeNextValuesDelay()
                if( nextDelay === null )  return
                if( nextDelay > 0 ){
                        timerId = setTimeout( dispatchNextValue, nextDelay )
                }else{
                        dispatchNextValue()
                }
        }

        function computeNextValuesDelay(){
                // console.log('nextValueIndex', nextValueIndex, recordAge)
                // if there is no more records, return now
                if( nextValueIndex >= _this._records.values.length )    return null
                // get the next return
                var value = _this._records.values[nextValueIndex]
                // compute the record age in recorder time
                var recordAge = value.recordedAt - _this._records.startedAt
                console.assert(recordAge >= 0 )
                // honor playbackRate
                recordAge /= _this.playbackRate
                // compute when to dispatch this record in absolute local time
                var absoluteTime = startedAt + recordAge
                // compute how much time we need to wait between absolute time and now
                var waitTime = absoluteTime - Date.now()
                // return waitTime
                return waitTime
        }
}
