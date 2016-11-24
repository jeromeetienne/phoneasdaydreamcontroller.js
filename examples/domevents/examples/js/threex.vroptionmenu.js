var THREEx = THREEx || {}

THREEx.VROptionMenu = function(domEvents, options){
	var _this = this
	this.object3d = new THREE.Group

	this.signals = {
		selected : new signals.Signal(),
	}

	this._optionItems = []
	
	Object.keys(options.items).forEach(function(itemKey, index){
		var itemValue = options.items[itemKey]

		var vrOptionItem = new THREEx.VROptionItem(domEvents, {
			label : options.items[itemKey],
			actionRight : options.actionRight,
			actionLeft : options.actionLeft,
		})

		vrOptionItem.object3d.position.set(0,-index*0.5,-2)
		_this.object3d.add( vrOptionItem.object3d )
		
		vrOptionItem.signals.selected.add(function(){
			_this.signals.selected.dispatch(itemKey)
		})
	})

	
	this.dispose = function(){
		this._optionItems.forEach(function(optionItem){
			optionItem.dispose()
		})
	}
}

