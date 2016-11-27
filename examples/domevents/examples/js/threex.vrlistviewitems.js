var THREEx = THREEx || {}

THREEx.VRListviewItems = function(domEvents, options){
	var _this = this
	this.object3d = new THREE.Group

	this._optionItems = []
	
	Object.keys(options.items).forEach(function(itemKey, index){
		var itemValue = options.items[itemKey]

		var vrOptionItem = new THREEx.VRListviewItem(domEvents, {
			label : options.items[itemKey],
			actionRight : options.actionRight,
			actionLeft : options.actionLeft,
		})

		vrOptionItem.object3d.position.y = -index*0.5
		_this.object3d.add( vrOptionItem.object3d )
	})

	
	this.dispose = function(){
		this._optionItems.forEach(function(optionItem){
			optionItem.dispose()
		})
	}
}
