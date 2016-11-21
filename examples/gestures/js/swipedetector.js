var SwipeDetector = function(){
        var _this = this
        this.signals = {
                swipe : new signals.Signal(),
        }
        
        this.options = {
                maxDelay : 2 * 1000,
                minDistance : 0.1
        }
        
        var startX = null
        var startY = null
        var startedAt = null

        this.start = function(x,y){
                // console.log('start', x, y)
                console.assert(x >= 0 && x <= 1.0 && y >= 0 && y <= 1.0)
                console.assert( startX === null && startY === null && startedAt === null)
                startX = x
                startY = y
                startedAt = Date.now()
        }
        this.update = function(x,y){}
        this.end = function(x,y){
                // sanity check
                console.assert(x >= 0 && x <= 1.0 && y >= 0 && y <= 1.0)
                console.assert( startX !== null && startY !== null && startedAt !== null)

                // set variables
                var delay = Date.now() - startedAt
                var deltaX = x - startX
                var deltaY = y - startY
                var distanceX = Math.abs(deltaX)
                var distanceY = Math.abs(deltaY)

                startX = null
                startY = null
                startedAt = null

                // discard it if the gesture took too long
                if( delay > _this.options.maxDelay )	return

                // detect if the swipe is horizontal or vertical
                if( distanceX > distanceY ){
                        // if it is a horizontale swipe
                        if( distanceX < _this.options.minDistance )	return
                        if( deltaX < 0 ){
                                _this.signals.swipe.dispatch('left')					
                        }else{
                                _this.signals.swipe.dispatch('right')					
                        }
                }else{
                        // if it is a vertical swipe
                        if( distanceY < _this.options.minDistance )	return
                        if( deltaY < 0 ){
                                _this.signals.swipe.dispatch('up')					
                        }else{
                                _this.signals.swipe.dispatch('down')					
                        }		
                }
        }
}
