var THREEx = THREEx || {}

THREEx.WebvrPlayer = function(){
        THREEx.JsonPlayer.call( this );
        
        this.frameData = null   // TODO put a fake one
        
        this._onNewRecord = function(newRecord){
                this.frameData = newRecord
        }
}
THREEx.WebvrPlayer.prototype = Object.create( THREEx.JsonPlayer.prototype );
THREEx.WebvrPlayer.prototype.constructor = THREEx.WebvrPlayer;

THREEx.WebvrPlayer.cookedLoad = function(baseUrl, nRecordsFiles, onLoaded){
	// var nRecordsFiles = 3
	// build the urls of the file to load
	var urls = []
	for(var i = 0; i < nRecordsFiles; i++){
		urls.push(baseUrl+pad(i, 4)+'.json')
	}
	// start loading those urls	
        var webvrPlayer = new THREEx.WebvrPlayer()
	webvrPlayer.load(urls, function(){
		console.log('loaded all webvr records')
                onLoaded && onLoaded(webvrPlayer)	
	})
	// polyfill to high-jack webvr API
	navigator.getGamepads = function(){
		return webvrPlayer.webvrs
	}
        
        return webvrPlayer
        
	function pad(num, size) {
                var s = num + '';
                while (s.length < size) s = '0' + s;
                return s;
        }
}
