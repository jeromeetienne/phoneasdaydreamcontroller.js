var THREEx = THREEx || {}

THREEx.GamepadRecorder = function(){
        var _this = this
        var records = {
                createdAt : Date.now(),
                values : []                
        }
        _this.records = records

        function update(){
                var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
                records.values.push({
                        recordedAt : Date.now(),
                        gamepads : gamepads
                })
        }
        function clear(){
                records.values = []
        }
        
        ////////////////////////////////////////////////////////////////////////////////
        //          Code Separator
        ////////////////////////////////////////////////////////////////////////////////
        var timerId = null
        this.start = function(){
                console.assert(timerId === null)
                timerId = setInterval(update, 1000/10)
        }
        this.stop = function(){
                clearInterval(timerId)
                timerId = null
        }
        
}

